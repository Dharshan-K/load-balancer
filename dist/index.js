"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const net = require("node:net");
const axios = require("axios");
var currentServer = null;
var backendServers = ["http://localhost:8081/", "http://localhost:8080/"];
const server = http.createServer((req, res) => {
    console.log(res.statusCode);
    routeServer(req, res);
});
const routeServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const firstServer = backendServers.shift();
    var server;
    let body = "";
    console.log("routing to the server........");
    if (firstServer != undefined) {
        server = firstServer;
    }
    else {
        res.end("no servers available");
        return;
    }
    req.on("data", (chunk) => {
        body += chunk;
        console.log("body", body);
    });
    if (server) {
        backendServers.push(server);
    }
    yield axios({
        method: req.method,
        url: server,
    });
    yield axios(req.url);
    res.statusCode = 200;
    res.end("response from python server");
});
server.listen('8000', 'localhost', () => {
    console.log("listening.....");
    setTimeout(() => {
        server.close(() => {
            console.log('server on port 8000 closed successfully');
        });
    }, 10000);
});
