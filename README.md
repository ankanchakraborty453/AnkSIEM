# AnkSIEM: A Mini SIEM Dashboard for Real-Time Log Monitoring and Threat Detection

AnkSIEM is a simplified SIEM dashboard inspired by tools like Splunk. It collects security logs, detects failed-login bursts, tracks suspicious IP addresses, generates alerts, and presents visual analytics in a dark cybersecurity console.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL/Auth/Realtime
- Recharts
- Lucide Icons

## Features

- Log collection through `POST /api/ingest`
- Failed login detection for 5 or more failures from the same IP in 10 minutes
- Suspicious IP scoring and watchlisting
- Alert generation and alert status updates
- Supabase Auth sign-in/sign-up
- Supabase Realtime dashboard refresh
- Suspicious IP block/clear workflow
- Health endpoint at `GET /api/health`
- Dashboard, logs, alerts, suspicious IPs, analytics, and settings pages
- Demo data fallback before Supabase credentials are configured

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

Run the database SQL in Supabase:

```bash
sql/schema.sql
sql/2026-05-09-functional-supabase.sql
sql/seed.sql
```

`SUPABASE_SERVICE_ROLE_KEY` is optional for the public demo flow. If it is not set, `/api/ingest`, alert resolution, and suspicious-IP actions use validated Supabase RPC functions with the publishable key.

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000/dashboard`.

Production URL:

```txt
https://anksiem.vercel.app
```

## Ingest Example

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source": "auth-service",
    "event_type": "LOGIN_FAILED",
    "username": "admin",
    "ip_address": "203.0.113.42",
    "status": "failed",
    "message": "Invalid password",
    "severity": "high"
  }'
```

## Threat Lab

The hosted dashboard includes `/dashboard/threat-lab`, a safe simulator that sends synthetic log events through `POST /api/ingest`.

Available scenarios:

- Brute force login burst
- External port scan
- Malware detection
- Unusual login location
- Custom JSON event injection

After a scenario runs, review `/dashboard/alerts`, `/dashboard/logs`, `/dashboard/suspicious-ips`, and `/dashboard/analytics` to confirm the detection path.

## Runtime Endpoints

```txt
POST  /api/ingest
GET   /api/logs
GET   /api/logs/export
GET   /api/alerts
PATCH /api/alerts/:id
GET   /api/suspicious-ips
PATCH /api/suspicious-ips/:ip
GET   /api/stats
GET   /api/health
```

## Project Structure

```txt
app/                 Next.js routes, dashboard pages, API endpoints
components/          Dashboard tables, cards, charts, shared UI
lib/detection/       Failed-login, suspicious-IP, and alert logic
lib/supabase/        Supabase browser and service clients
sql/                 Schema and seed scripts
types/               Shared TypeScript models
```

## Branch Plan

```txt
main
dev
feature/auth
feature/dashboard-ui
feature/log-ingestion
feature/detection-engine
feature/alerts
feature/analytics
```
