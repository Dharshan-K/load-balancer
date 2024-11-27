import { IncomingMessage, ServerResponse } from "http";

const http = require("http");
const net = require("node:net")
const axios = require("axios")
var currentServer = null;
var backendServers: Array<string> = ["http://localhost:8081/", "http://localhost:8080", "http://localhost:8082"]
var unavailableServers: Array<string> = [];

const server = http.createServer((req: IncomingMessage,res: ServerResponse)=>{
  console.log(res.statusCode);
  routeServer(req,res)
})

const routeServer = async(req: IncomingMessage,res: ServerResponse)=>{
  const serverToSendRequest = backendServers.shift();
  var server:string;
  let body = "";
  console.log("routing to the server........")
  if(serverToSendRequest != undefined){
    server = serverToSendRequest;
    console.log("url", req.url)
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
    console.log("server ", backendServers)
  }
  
  await axios({
    method: req.method,
    url: server,
  }).then((response: any)=>{
    res.statusCode = 200;
    const headers = new Headers({ 'Content-Type' : 'text/plain'})
    res.setHeaders(headers)
    res.end(response.data)
  })
}

async function checkServer(){
  try{
    for(let i=0;i< backendServers.length;i++){
      await axios({
        method: "GET",
        url: `${backendServers[i]}health`
      })
    }
  }catch(err:any){
    console.log("server is down", err.port) 
    const server = `http://localhost:${err.port}/`
    backendServers = backendServers.filter((element)=> {element!=server})
    unavailableServers.push(server)
    console.log(`server ${server} removed`);
    console.log(backendServers)
  }
}

server.listen('8000', 'localhost', ()=>{
  console.log("listening.....")
  setInterval(async()=>{
    checkServer()
    // console.log("list of available servers:")
    // console.log(backendServers)
    // try{
    //   for(let i=0;i<backendServers.length;i++){
    //     await axios({
    //       method: "GET",
    //       url: `${backendServers[i]}health`
    //     }).then((response:any)=>{
    //       console.log("health ", response.data, response.status)
    //     })
    //   }      
    // }catch(err:any){
    //   console.log("server is down", err.port) 
    //   const server = `http://localhost:${err.port}/`
    //   backendServers = backendServers.filter((element)=> {element!=server})
    //   unavailableServers.push(server)
    //   console.log(`server ${server} removed`);
    //   console.log(backendServers)
    // }
  }, 10000)
})



