"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const server = http.createServer((req, res) => {
    console.log(res.statusCode);
});
const server2 = http.createServer((req, res) => {
    console.log(res.statusCode);
});
server.listen('8080', 'localhost', () => {
    console.log("listening.....");
    setTimeout(() => {
        server.close(() => {
            console.log('server on port 8000 closed successfully');
        });
    }, 10000);
});
server2.listen('8081', 'localhost', () => {
    console.log("listening.....");
    setTimeout(() => {
        server.close(() => {
            console.log('server on port 8000 closed successfully');
        });
    }, 10000);
});
