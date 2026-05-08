create extension if not exists pgcrypto;

alter table public.logs enable row level security;
alter table public.alerts enable row level security;
alter table public.suspicious_ips enable row level security;

create index if not exists alerts_log_id_idx on public.alerts (log_id);

drop policy if exists "Public read logs" on public.logs;
create policy "Public read logs"
on public.logs
for select
to anon, authenticated
using (true);

drop policy if exists "Public read alerts" on public.alerts;
create policy "Public read alerts"
on public.alerts
for select
to anon, authenticated
using (true);

drop policy if exists "Public read suspicious ips" on public.suspicious_ips;
create policy "Public read suspicious ips"
on public.suspicious_ips
for select
to anon, authenticated
using (true);

create or replace function public.increment_suspicious_ip(
  target_ip text,
  failed_delta int default 0,
  risk_delta int default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.suspicious_ips (ip_address, failed_attempts, risk_score, last_seen, status)
  values (
    target_ip,
    greatest(failed_delta, 0),
    least(greatest(risk_delta, 0), 100),
    now(),
    case when risk_delta >= 60 then 'watchlisted' else 'observed' end
  )
  on conflict (ip_address)
  do update set
    failed_attempts = public.suspicious_ips.failed_attempts + greatest(failed_delta, 0),
    risk_score = least(100, public.suspicious_ips.risk_score + greatest(risk_delta, 0)),
    last_seen = now(),
    status = case
      when least(100, public.suspicious_ips.risk_score + greatest(risk_delta, 0)) >= 60 then 'watchlisted'
      else public.suspicious_ips.status
    end;
end;
$$;

create or replace function public.ingest_security_log(
  p_source text,
  p_event_type text,
  p_timestamp timestamptz default now(),
  p_username text default null,
  p_ip_address text default null,
  p_status text default null,
  p_message text default null,
  p_severity text default 'low'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_log public.logs%rowtype;
  v_risk int := 0;
  v_failed_count int := 0;
  v_alerts_created int := 0;
  v_rules text[] := array[]::text[];
  v_alert_type text;
  v_alert_severity text;
  v_alert_title text;
  v_alert_description text;
begin
  if nullif(trim(p_source), '') is null or nullif(trim(p_event_type), '') is null then
    raise exception 'source and event_type are required';
  end if;

  if coalesce(p_severity, 'low') not in ('low', 'medium', 'high', 'critical') then
    raise exception 'invalid severity: %', p_severity;
  end if;

  insert into public.logs (timestamp, source, event_type, username, ip_address, status, message, severity)
  values (
    coalesce(p_timestamp, now()),
    trim(p_source),
    trim(p_event_type),
    nullif(trim(coalesce(p_username, '')), ''),
    nullif(trim(coalesce(p_ip_address, '')), ''),
    nullif(trim(coalesce(p_status, '')), ''),
    nullif(trim(coalesce(p_message, '')), ''),
    coalesce(p_severity, 'low')
  )
  returning * into v_log;

  if v_log.event_type = 'LOGIN_FAILED' then v_risk := v_risk + 10; end if;
  if v_log.event_type = 'PORT_SCAN' then v_risk := v_risk + 30; end if;
  if v_log.event_type = 'MALWARE_DETECTED' then v_risk := v_risk + 40; end if;
  if v_log.event_type = 'UNUSUAL_LOCATION' then v_risk := v_risk + 20; end if;
  if v_log.severity = 'critical' then v_risk := v_risk + 30; end if;
  if v_log.severity = 'high' then v_risk := v_risk + 20; end if;
  if v_log.status = 'blocked' then v_risk := v_risk + 15; end if;
  v_risk := least(v_risk, 100);

  if v_log.ip_address is not null then
    perform public.increment_suspicious_ip(
      v_log.ip_address,
      case when v_log.event_type = 'LOGIN_FAILED' or v_log.status = 'failed' then 1 else 0 end,
      v_risk
    );
  end if;

  if v_log.ip_address is not null and v_log.event_type = 'PORT_SCAN' then
    v_alert_type := 'PORT_SCAN';
    v_alert_severity := case when v_log.severity = 'critical' then 'critical' else 'high' end;
    v_alert_title := 'Port scan detected';
    v_alert_description := 'Sequential probing activity was detected from ' || v_log.ip_address || '.';
  elsif v_log.ip_address is not null and v_log.event_type = 'MALWARE_DETECTED' then
    v_alert_type := 'MALWARE_DETECTED';
    v_alert_severity := 'critical';
    v_alert_title := 'Malware detection reported';
    v_alert_description := coalesce(v_log.message, 'Endpoint telemetry reported a malware detection.');
  elsif v_log.ip_address is not null and v_log.event_type = 'UNUSUAL_LOCATION' then
    v_alert_type := 'UNUSUAL_LOCATION';
    v_alert_severity := case when v_log.severity in ('high', 'critical') then v_log.severity else 'medium' end;
    v_alert_title := 'Unusual login location';
    v_alert_description := coalesce(v_log.message, 'Unusual login context observed.');
  elsif v_log.ip_address is not null and v_log.severity = 'critical' then
    v_alert_type := 'CRITICAL_EVENT';
    v_alert_severity := 'critical';
    v_alert_title := 'Critical security event';
    v_alert_description := coalesce(v_log.message, 'A critical severity event was ingested.');
  end if;

  if v_alert_type is not null then
    v_rules := array_append(v_rules, v_alert_type);
    if not exists (
      select 1 from public.alerts
      where alert_type = v_alert_type
        and ip_address is not distinct from v_log.ip_address
        and status = 'open'
        and created_at >= now() - interval '10 minutes'
    ) then
      insert into public.alerts (log_id, alert_type, severity, title, description, ip_address, username, status)
      values (v_log.id, v_alert_type, v_alert_severity, v_alert_title, v_alert_description, v_log.ip_address, v_log.username, 'open');
      v_alerts_created := v_alerts_created + 1;
    end if;
  elsif v_log.ip_address is not null and (v_log.event_type = 'LOGIN_FAILED' or v_log.status = 'failed') then
    v_rules := array_append(v_rules, 'FAILED_LOGIN_OBSERVED');
    select count(*) into v_failed_count
    from public.logs
    where ip_address = v_log.ip_address
      and event_type = 'LOGIN_FAILED'
      and timestamp >= coalesce(p_timestamp, now()) - interval '10 minutes';

    if v_failed_count >= 5 then
      v_rules := array_append(v_rules, 'BRUTE_FORCE_ATTEMPT');
      if not exists (
        select 1 from public.alerts
        where alert_type = 'BRUTE_FORCE_ATTEMPT'
          and ip_address = v_log.ip_address
          and status = 'open'
          and created_at >= now() - interval '10 minutes'
      ) then
        insert into public.alerts (log_id, alert_type, severity, title, description, ip_address, username, status)
        values (
          v_log.id,
          'BRUTE_FORCE_ATTEMPT',
          'high',
          'Brute force attempt detected',
          v_failed_count || ' failed login attempts from ' || v_log.ip_address || ' in the last 10 minutes.',
          v_log.ip_address,
          v_log.username,
          'open'
        );
        v_alerts_created := v_alerts_created + 1;
      end if;
    end if;
  end if;

  return jsonb_build_object(
    'log', to_jsonb(v_log),
    'detection', jsonb_build_object(
      'alertsCreated', v_alerts_created,
      'riskScore', v_risk,
      'rulesMatched', v_rules
    )
  );
end;
$$;

create or replace function public.resolve_alert(p_alert_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_alert public.alerts%rowtype;
begin
  update public.alerts
  set status = 'resolved'
  where id = p_alert_id
  returning * into v_alert;

  if v_alert.id is null then
    raise exception 'alert not found';
  end if;

  return to_jsonb(v_alert);
end;
$$;

revoke execute on function public.increment_suspicious_ip(text, int, int) from public;
revoke execute on function public.increment_suspicious_ip(text, int, int) from anon, authenticated;
grant execute on function public.increment_suspicious_ip(text, int, int) to service_role;
grant execute on function public.ingest_security_log(text, text, timestamptz, text, text, text, text, text) to anon, authenticated, service_role;
grant execute on function public.resolve_alert(uuid) to anon, authenticated, service_role;

create or replace function public.set_suspicious_ip_status(
  p_ip_address text,
  p_status text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ip public.suspicious_ips%rowtype;
begin
  if p_status not in ('observed', 'watchlisted', 'blocked', 'cleared') then
    raise exception 'invalid suspicious IP status: %', p_status;
  end if;

  update public.suspicious_ips
  set status = p_status,
      last_seen = now()
  where ip_address = p_ip_address
  returning * into v_ip;

  if v_ip.id is null then
    raise exception 'suspicious IP not found';
  end if;

  return to_jsonb(v_ip);
end;
$$;

grant execute on function public.set_suspicious_ip_status(text, text) to anon, authenticated, service_role;

revoke execute on function public.ingest_security_log(text, text, timestamptz, text, text, text, text, text) from public;
revoke execute on function public.resolve_alert(uuid) from public;
revoke execute on function public.set_suspicious_ip_status(text, text) from public;
grant execute on function public.ingest_security_log(text, text, timestamptz, text, text, text, text, text) to anon, authenticated, service_role;
grant execute on function public.resolve_alert(uuid) to anon, authenticated, service_role;
grant execute on function public.set_suspicious_ip_status(text, text) to anon, authenticated, service_role;
