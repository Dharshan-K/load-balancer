import { IncomingMessage, ServerResponse } from "http";

const http = require("http");

const server = http.createServer((req: IncomingMessage,res: ServerResponse)=>{
  if(req.method == "GET" && req.url == "/health"){
    res.statusCode = 200
    console.log("checking health.....")
    const headers = new Headers({ 'Content-Type' : 'text/plain'})
    res.setHeaders(headers)
    res.end("server is up")
  }else if(req.url == "/sendFile"){
    res.end(__dirname)
  }else{
    res.statusCode = 404;
    res.end("Not Found");
  }
})

const server2 = http.createServer((req: IncomingMessage,res: ServerResponse)=>{
  if(req.method == "GET" && req.url == "/health"){
    res.statusCode = 200
    console.log("checking health.....")
    res.setHeader('Content-Type' , 'text/plain')
    res.end("server is up")
  }else if(req.url == "/sendFile"){
    res.end({data: __dirname,__filename})
  }else{
    res.statusCode = 404;
    res.end("Not Found");
  }
})


server.listen('8080', 'localhost', ()=>{
  console.log("listening.....")
})


server2.listen('8081', 'localhost', ()=>{
  console.log("listening.....")
})