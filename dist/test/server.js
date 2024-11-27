"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const server = http.createServer((req, res) => {
    if (req.method == "GET" && req.url == "/health") {
        res.statusCode = 200;
        console.log("checking health.....");
        const headers = new Headers({ 'Content-Type': 'text/plain' });
        res.setHeaders(headers);
        res.end('Server at 8080 healthy......');
        return;
    }
    res.end("response from 8080");
});
const server2 = http.createServer((req, res) => {
    console.log(res.statusCode);
    res.end("response from 8081");
});
server.listen('8080', 'localhost', () => {
    console.log("listening.....");
});
server2.listen('8081', 'localhost', () => {
    console.log("listening.....");
});
