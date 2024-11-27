import { IncomingMessage, ServerResponse } from "http";

const http = require("http");

const server = http.createServer((req: IncomingMessage,res: ServerResponse)=>{
  if(req.method == "GET" && req.url == "/health"){
    res.statusCode = 200
    console.log("checking health.....")
    const headers = new Headers({ 'Content-Type' : 'text/plain'})
    res.setHeaders(headers)
    res.end(true)
    return
  }
  res.end("response from 8080")
})

const server2 = http.createServer((req: IncomingMessage,res: ServerResponse)=>{
  if(req.method == "GET" && req.url == "/health"){
    res.statusCode = 200
    console.log("checking health.....")
    const headers = new Headers({ 'Content-Type' : 'text/plain'})
    res.setHeaders(headers)
    res.end(true)
    return
  }
  res.end("response from 8081")
})


server.listen('8080', 'localhost', ()=>{
  console.log("listening.....")
})


server2.listen('8081', 'localhost', ()=>{
  console.log("listening.....")
})