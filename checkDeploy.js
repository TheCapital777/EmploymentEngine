const https = require('https');
process.loadEnvFile('.env.local');

const token = process.env.NETLIFY_API_TOKEN;
const siteId = process.env.NETLIFY_SITE_ID;

const options = {
  hostname: 'api.netlify.com',
  port: 443,
  path: `/api/v1/sites/${siteId}/deploys`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    const deploys = JSON.parse(body);
    console.log(deploys.slice(0, 2).map(d => ({ state: d.state, error: d.error_message, branch: d.branch, created: d.created_at })));
  });
});
req.end();
