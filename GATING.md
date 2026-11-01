# Server-side access gating

Private areas are protected on the server, before any file is sent. A visitor without a valid
access cookie is redirected to `/gate.html`, whatever address they type, including direct
addresses such as `/carecircle/app.html`.

## Protected areas

| Area key | Covers |
|---|---|
| carecircle | /carecircle/ (Remiel Amicura) |
| pathfinder | /pathfinder/ |
| remiel | /remiel/ (Remiel Sentinel) |
| covara | /covara/ (Remiel: Covara) |
| halo | /halo/ (Remiel: Personal Protection) |
| proteus | /product/proteus.html |
| optics | /product/remiel-optics.html |

## How it works

1. `middleware.js` runs on Vercel for the paths above and checks for a cookie named
   `bi_gate_<area>`, signed with `GATE_SECRET`.
2. `gate.html` sends the code to `api/unlock.js`.
3. `api/unlock.js` hashes the code (SHA-256 of `carecircle:` plus the code, trimmed and in
   upper case) and compares it with the hashes in `GATE_KEYS`. On a match it sets an
   HttpOnly, Secure cookie valid for 30 days for that area only. Failed attempts are rate limited.

No access code is stored in this repository.

## Environment variables (Vercel project settings)

- `GATE_SECRET`: a long random string used to sign cookies. Changing it signs everyone out.
- `GATE_KEYS`: JSON mapping each area key to a list of code hashes, for example
  `{"proteus":["<sha256>"],"covara":["<sha256>"]}`.

To add or change a code, compute the hash and update `GATE_KEYS`:

```
python3 -c "import hashlib;print(hashlib.sha256(('carecircle:'+'NEW-CODE').upper().replace('CARECIRCLE:','carecircle:').encode()).hexdigest())"
```

## Hosting requirement

This gating works only when the site is served by Vercel. GitHub Pages serves files without any
server check, so GitHub Pages must be turned off once the domain points to Vercel, and the
repository should be private so the app source cannot be read on GitHub.
