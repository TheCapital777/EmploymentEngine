const https = require('https');
process.loadEnvFile('.env.local');

const token = process.env.NETLIFY_API_TOKEN;
const siteId = process.env.NETLIFY_SITE_ID;
const data = JSON.stringify({
  custom_domain: "jengacv.co.tz"
});

const options = {
  hostname: 'api.netlify.com',
  port: 443,
  path: `/api/v1/sites/${siteId}`,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
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
