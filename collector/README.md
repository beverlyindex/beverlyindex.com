# CareCircle Collector

Serverless telemetry collector for CareCircle access intelligence. Deployed to Vercel as its own project, separate from the GitHub Pages site.

## Deploy

1. Create a new Vercel project linked to this `/collector` folder (or push the folder as its own repo).
2. Set environment variables in the Vercel dashboard:

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes | Resend API key for sending alert emails |
| `ALERT_TO` | Yes | Recipient email (e.g. `rrbjr@remielengine.ai`) |
| `ALERT_FROM` | Yes | Sender email (e.g. `CareCircle Alerts <alerts@beverly-index.com>`) |
| `TELEMETRY_TOKEN` | Yes | Shared token for `x-cc-t` header (filters junk, not attackers) |

3. Deploy: `vercel --prod` (or auto-deploy via Git integration).
4. Note the production URL (e.g. `https://cc-collector.vercel.app`).
5. Set `COLLECTOR_URL` in the site telemetry helper to this URL.

## Endpoint

`POST /api/t` accepts JSON telemetry beacons. Always responds 204.

CORS allows `https://beverly-index.com` only.

## Event types

| Event | Email | Description |
|-------|-------|-------------|
| `gate_success` | ENTRY alert | Sent immediately on successful gate access |
| `gate_fail` | FAILED ATTEMPTS (1 per burst) | Failed access code attempt |
| `session_end` | SESSION summary | Sent on tab close with usage data |
| `heartbeat` | None (204 only) | Liveness signal, reserved for future use |

## No PHI

Telemetry payloads contain only enumerated event-type constants, counts, and timestamps. No patient names, contact names, symptom text, medication names, photo data, captions, or free-text content is ever transmitted.
