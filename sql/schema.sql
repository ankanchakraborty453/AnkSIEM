create extension if not exists pgcrypto;

create table if not exists logs (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  source text not null,
  event_type text not null,
  username text,
  ip_address text,
  status text,
  message text,
  severity text default 'low' check (severity in ('low', 'medium', 'high', 'critical')),
  created_at timestamptz default now()
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  log_id uuid references logs(id) on delete cascade,
  alert_type text not null,
  severity text not null check (severity in ('low', 'medium', 'high', 'critical')),
  title text not null,
  description text,
  ip_address text,
  username text,
  status text default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz default now()
);

create table if not exists suspicious_ips (
  id uuid primary key default gen_random_uuid(),
  ip_address text unique not null,
  failed_attempts int default 0,
  risk_score int default 0,
  last_seen timestamptz default now(),
  country text,
  status text default 'watchlisted'
);

create index if not exists logs_timestamp_idx on logs (timestamp desc);
create index if not exists logs_ip_idx on logs (ip_address);
create index if not exists logs_event_type_idx on logs (event_type);
create index if not exists alerts_status_idx on alerts (status);
create index if not exists suspicious_ips_risk_idx on suspicious_ips (risk_score desc);

create or replace function increment_suspicious_ip(
  target_ip text,
  failed_delta int default 0,
  risk_delta int default 0
)
returns void
language plpgsql
as $$
begin
  insert into suspicious_ips (ip_address, failed_attempts, risk_score, last_seen, status)
  values (
    target_ip,
    greatest(failed_delta, 0),
    least(greatest(risk_delta, 0), 100),
    now(),
    case when risk_delta >= 60 then 'watchlisted' else 'observed' end
  )
  on conflict (ip_address)
  do update set
    failed_attempts = suspicious_ips.failed_attempts + greatest(failed_delta, 0),
    risk_score = least(100, suspicious_ips.risk_score + greatest(risk_delta, 0)),
    last_seen = now(),
    status = case
      when least(100, suspicious_ips.risk_score + greatest(risk_delta, 0)) >= 60 then 'watchlisted'
      else suspicious_ips.status
    end;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table logs;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table alerts;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table suspicious_ips;
exception
  when duplicate_object then null;
end $$;
