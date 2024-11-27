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
        console.log("url", req.url);
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
        console.log("server ", backendServers);
    }
    yield axios({
        method: req.method,
        url: server,
    }).then((response) => {
        res.statusCode = 200;
        const headers = new Headers({ 'Content-Type': 'text/plain' });
        res.setHeaders(headers);
        res.end(response.data);
    });
});
server.listen('8000', 'localhost', () => {
    console.log("listening.....");
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log("list of available servers:");
        console.log(backendServers);
        try {
            yield axios({
                method: "GET",
                url: "http://localhost:8080/health"
            }).then((response) => {
                console.log("health ", response.data, response.status);
            });
        }
        catch (err) {
            console.log("server is down", err.port);
            const server = `http://localhost:${err.port}/`;
            backendServers = backendServers.filter((element) => element != server);
            console.log(`server ${server} removed`);
            console.log(backendServers);
        }
    }), 10000);
});
