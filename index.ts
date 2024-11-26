import { IncomingMessage, ServerResponse } from "http";

const http = require("http");
const net = require("node:net")
const axios = require("axios")
var currentServer = null;
var backendServers: Array<string> = ["http://localhost:8081/", "http://localhost:8080/"]

const server = http.createServer((req: IncomingMessage,res: ServerResponse)=>{
  console.log(res.statusCode);
  routeServer(req,res)
})

const routeServer = async(req: IncomingMessage,res: ServerResponse)=>{
  const firstServer = backendServers.shift();
  var server:string;
  let body = "";
  console.log("routing to the server........")
  if(firstServer != undefined){
    server = firstServer;
  }else{
    res.end("no servers available")
    return
  }

  req.on("data",(chunk)=>{
    body += chunk
    console.log("body", body)
  })
  
  if(server){
    backendServers.push(server)
  }
  
  await axios({
    method: req.method,
    url: server,
  })

  await axios(req.url)
  res.statusCode = 200;
  res.end("response from python server")
}



server.listen('8000', 'localhost', ()=>{
  console.log("listening.....")
  setTimeout(() => {
    server.close(() => {
      console.log('server on port 8000 closed successfully');
    });
  }, 10000); 
})



