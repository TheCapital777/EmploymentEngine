const { execFileSync } = require('child_process');
process.loadEnvFile('.env.local');

try {
  const data = JSON.stringify({ name: "jengacv.co.tz", account_id: "6809e22f177a82909a99de75" });
  const output = execFileSync('npx.cmd', ['netlify', 'api', 'createDnsZone', '--data', data], { encoding: 'utf-8' });
  console.log(output);
} catch (e) {
  console.error(e.stdout || e.message);
}
