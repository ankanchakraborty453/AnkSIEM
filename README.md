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
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

Run the database SQL in Supabase:

```bash
sql/schema.sql
sql/seed.sql
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000/dashboard`.

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
