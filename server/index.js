const env = require('dotenv');
const https = require('https');
const http = require('http');
const fs = require('fs');

env.config();

const app = require('./app');

const httpsPort = process.env.HTTPS_PORT || 3001;
const httpPort = process.env.HTTP_PORT || 3000;

require('./models').connection();

const httpsOptions = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem'),
};

https.createServer(httpsOptions, app).listen(httpsPort, () => {
  console.log(`https server running at ${httpsPort}`);
});

http.createServer(app).listen(httpPort, () => {
  console.log(`http server running at ${httpPort}`);
});
