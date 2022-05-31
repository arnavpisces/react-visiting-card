// server/index.js
const path = require('path');
const express = require("express");
// const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;

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

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});