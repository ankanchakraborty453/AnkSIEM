insert into logs (source, event_type, username, ip_address, status, message, severity, timestamp)
values
  ('auth-service', 'LOGIN_FAILED', 'admin', '203.0.113.42', 'failed', 'Invalid password for privileged account', 'high', now() - interval '4 minutes'),
  ('auth-service', 'LOGIN_FAILED', 'admin', '203.0.113.42', 'failed', 'Invalid password for privileged account', 'high', now() - interval '5 minutes'),
  ('auth-service', 'LOGIN_FAILED', 'admin', '203.0.113.42', 'failed', 'Invalid password for privileged account', 'high', now() - interval '6 minutes'),
  ('edge-firewall', 'PORT_SCAN', null, '198.51.100.18', 'blocked', 'Sequential port probe detected', 'critical', now() - interval '12 minutes'),
  ('endpoint-agent', 'MALWARE_DETECTED', 'ankit', '10.10.4.21', 'quarantined', 'Suspicious binary isolated', 'critical', now() - interval '28 minutes');

insert into alerts (alert_type, severity, title, description, ip_address, username, status)
values
  ('BRUTE_FORCE_ATTEMPT', 'high', 'Brute force attempt detected', 'Repeated failed login attempts from a single source IP.', '203.0.113.42', 'admin', 'open'),
  ('PORT_SCAN', 'critical', 'External reconnaissance blocked', 'Firewall blocked a high-rate scan pattern against exposed services.', '198.51.100.18', null, 'open');

insert into suspicious_ips (ip_address, failed_attempts, risk_score, country, status)
values
  ('203.0.113.42', 5, 78, 'Unknown', 'watchlisted'),
  ('198.51.100.18', 2, 92, 'Unknown', 'watchlisted')
on conflict (ip_address) do nothing;
