# Deploy Guide — Terras de Gaia (cPanel)

## How the server works

- **Apache + mod_proxy** proxies all `terrasdegaia.pt` traffic to `http://127.0.0.1:3000`
- **Node.js process** (`next-server`) runs manually via `nohup`, bound to `0.0.0.0:3000`
- **Phusion Passenger** block has been **removed** from `.htaccess` — it conflicted with the cms subdomain. Do NOT re-add it via cPanel's Node.js app manager.
- The process title shows as `next-server (v16.2.4)` in `ps aux`, not `node`
- A `@reboot` cron auto-starts the server after reboots

---

## Deploy new code (standard procedure)

SSH into the server, then:

```bash
# 1. Activate the Node.js virtual environment
source ~/nodevenv/Terras-de-Gaia/22/bin/activate

# 2. Pull latest code
cd ~/Terras-de-Gaia && git pull

# 3. Build
bash build.sh

# 4. Kill the old server (use semicolon, not &&, so it continues even if no process exists)
pkill -f 'next-server'; sleep 2

# 5. Start the new server
PORT=3000 HOSTNAME=0.0.0.0 nohup node server.js > ~/logs/nextjs.log 2>&1 &

# 6. Wait and verify new CSS hash is being served
sleep 10 && curl -s http://localhost:3000/ | grep -o 'css/[a-f0-9]*\.css' | head -3
```

Production check:
```bash
curl -s https://terrasdegaia.pt/ | grep -o 'css/[a-f0-9]*\.css' | head -3
```

---

## One-liner (copy-paste)

```bash
source ~/nodevenv/Terras-de-Gaia/22/bin/activate && cd ~/Terras-de-Gaia && git pull && bash build.sh && pkill -f 'next-server'; sleep 2 && PORT=3000 HOSTNAME=0.0.0.0 nohup node server.js > ~/logs/nextjs.log 2>&1 & sleep 10 && curl -s http://localhost:3000/ | grep -o 'css/[a-f0-9]*\.css' | head -3
```

> **Note:** The `;` after `pkill` is intentional — `pkill` returns exit 1 if nothing was killed, which would abort `&&` chains.

---

## Verify the server is running

```bash
ps aux | grep 'next-server' | grep -v grep
tail -20 ~/logs/nextjs.log
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/
```

---

## If the server won't start (500/503 on site)

```bash
# Check startup errors
tail -50 ~/logs/nextjs.log

# Run manually to see errors in real time (Ctrl+C to stop)
cd ~/Terras-de-Gaia && PORT=3000 HOSTNAME=0.0.0.0 node server.js
```

---

## Key paths

| What | Path |
|------|------|
| App root | `~/Terras-de-Gaia/` |
| Build script | `~/Terras-de-Gaia/build.sh` |
| Compiled server | `~/Terras-de-Gaia/server.js` |
| Next.js build output | `~/Terras-de-Gaia/.next/standalone/` |
| Server log | `~/logs/nextjs.log` |
| Apache config | `~/public_html/.htaccess` |
| Node.js venv | `~/nodevenv/Terras-de-Gaia/22/` |
