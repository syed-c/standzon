/**
 * One-time content migration: fix the "...Stand Buildersin <City>" typo
 * (missing space) that appears in ~187 `page_contents` rows and renders as a
 * broken <h1> on every affected location page.
 *
 * Safe + idempotent: only rows containing the literal "Buildersin" are touched,
 * and the only change is "Buildersin" -> "Builders in" inside the JSON content.
 *
 * Usage:  node scripts/fix-h1-buildersin-typo.js
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 */
const fs = require('fs');
const path = require('path');

// minimal .env loader
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const REST = `${URL}/rest/v1/page_contents`;
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

(async () => {
  const rows = await (await fetch(`${REST}?select=id,content`, { headers })).json();
  const backupDir = path.join(__dirname, '..', 'data', 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backup = path.join(backupDir, `page_contents.${Date.now()}.json`);
  fs.writeFileSync(backup, JSON.stringify(rows, null, 2));
  console.log(`Backup written: ${backup} (${rows.length} rows)`);

  let fixed = 0;
  for (const row of rows) {
    const raw = JSON.stringify(row.content);
    if (!raw.includes('Buildersin')) continue;
    const newContent = JSON.parse(raw.replace(/Buildersin/g, 'Builders in'));
    const res = await fetch(`${REST}?id=eq.${encodeURIComponent(row.id)}`, {
      method: 'PATCH',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({ content: newContent }),
    });
    if (!res.ok) { console.error(`FAILED ${row.id}: ${res.status} ${await res.text()}`); process.exit(1); }
    fixed++;
    console.log(`fixed ${row.id}`);
  }
  console.log(`\nDone. Patched ${fixed} rows. Rollback = restore ${path.basename(backup)}.`);
})();
