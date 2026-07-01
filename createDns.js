const https = require('https');
process.loadEnvFile('.env.local');

const token = process.env.NETLIFY_API_TOKEN;
const data = JSON.stringify({
  name: "jengacv.co.tz",
  account_slug: "akingb-kb"
});

const options = {
  hostname: 'api.netlify.com',
  port: 443,
  path: '/api/v1/dns_zones',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': `Bearer ${token}`
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => console.log(body));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
