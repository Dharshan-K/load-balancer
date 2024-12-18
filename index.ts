import { IncomingMessage, ServerResponse } from "http";

const http = require("http");
const net = require("node:net")
const axios = require("axios")
var currentServer = null;
const LoadBalancer = require("./balancer")
const balancer = new LoadBalancer();
const baseURL = "http://localhost:"

const server = http.createServer(async(req: IncomingMessage,res: ServerResponse)=>{
  if(req.method == "POST"){
    let body = ""
    req.on("data", (chunk:any)=>{
      body += chunk.toString();      
    })
  }

  // if(req.url?.includes("/health") && req.method== "GET"){
  //   const url = new URL(req.url, `http://localhost`)
  //   const params = url.searchParams;
  //   const answer = await balancer.checkHealthStatus({url: `${baseURL}${params.get('port')}`, healthEndpoint: `${baseURL}${params.get('port')}/health`})
  //   res.end(answer)
  // }

  const response = await balancer.routeRequests(req,res)
  res.end(response)
})

server.listen('8000', 'localhost', async ()=>{
  console.log("listening.....")
  const path = "/home/dharshan/open source/rateLimit.io/servers.txt"
  await balancer.addServers(path) 
  await balancer.checkAllServers()
  // await balancer.checkUnavailableServers()
})



