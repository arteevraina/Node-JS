const express = require('express');

const http = require('http');

const hostName = 'localhost';
const port = 3000;

const app = express();

app.use( (req, res, next) => {
    console.log(req.headers);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');
});

const Server = http.createServer(app);

Server.listen(port, hostName, () => {
    console.log(`Server running at http://${hostName}:${port}`);
});