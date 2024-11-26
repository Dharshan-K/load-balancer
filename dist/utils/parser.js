"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerParser = exports.requestParser = void 0;
function requestParser(req, res) {
    const headers = req.headers;
    const method = req.method;
    const path = req.url;
    const body = "";
    const status = res.status;
    console.log(headers, method, path, body, status);
}
exports.requestParser = requestParser;
function headerParser() {
}
exports.headerParser = headerParser;
