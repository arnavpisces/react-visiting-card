// server/index.js
const path = require('path');
const express = require("express");
const fs = require('fs');
const https = require('https');
const http = require('http');
const PORT = process.env.PORT || 443;
const privateKey = fs.readFileSync('/etc/letsencrypt/live/arnavk.co/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/arnavk.co/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/arnavk.co/chain.pem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};
const app = express();
app.use((req, res, next) => {
  if (!isSecure(req)) {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
});
function isSecure(req) {
  if (req.headers['x-forwarded-proto']) {
    return req.headers['x-forwarded-proto'] === 'https';
  }
  return req.secure;
};
app.enable('trust proxy')
app.use(express.static(path.resolve(__dirname, '../visiting-card/build')));
app.get('/resume', (req, res) =>{
  res.sendFile(path.resolve(__dirname, '../visiting-card/src','resume.pdf'));
});
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, '../visiting-card/build', 'index.html'));
});
app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
const httpServer = http.createServer (app);
httpServer.listen(80, () =>{
  console.log(`Server listening on 80`)
});