/**
 * One-time content cleanup: remove stray test text ("Rayyan") that was typed
 * into a few `page_contents` rows during testing. Only the rows listed in ROWS
 * are touched, and only the literal token "Rayyan" (never the Qatari city
 * "Al Rayyan") is stripped.
 *
 * Usage:  node scripts/clean-cms-test-text.js
 */
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) { console.error('Missing Supabase env'); process.exit(1); }
const REST = `${URL}/rest/v1/page_contents`;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

const ROWS = ['custom-booth', 'china', 'germany'];

function strip(str) {
  // remove " Rayyan" / "Rayyan " / standalone "Rayyan", but never "Al Rayyan"
  return str
    .replace(/(?<!Al )\bRayyan\b/g, '')
    .replace(/ {2,}/g, ' ')
    .replace(/ ([.,!?;:])/g, '$1')
    .replace(/\s+"/g, '"');
}

(async () => {
  const backupDir = path.join(__dirname, '..', 'data', 'backups');
  fs.mkdirSync(backupDir, { recursive: true });

  for (const id of ROWS) {
    const rows = await (await fetch(`${REST}?select=id,content&id=eq.${id}`, { headers })).json();
    if (!rows.length) { console.log(`skip ${id} (not found)`); continue; }
    const raw = JSON.stringify(rows[0].content);
    if (!raw.includes('Rayyan')) { console.log(`skip ${id} (clean)`); continue; }
    fs.writeFileSync(path.join(backupDir, `${id}.${Date.now()}.json`), raw);
    const cleaned = JSON.parse(strip(raw));
    const res = await fetch(`${REST}?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ content: cleaned }),
    });
    if (!res.ok) { console.error(`FAILED ${id}: ${res.status} ${await res.text()}`); process.exit(1); }
    console.log(`cleaned ${id}`);
  }
  console.log('done');
})();
