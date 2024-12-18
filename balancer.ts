import { IncomingMessage, ServerResponse } from "http";

const axios = require('axios')
const fs = require("fs").promises;

class LoadBalancer{
  private availableServers: any[] = [];
  private unavailableServers: string[] = [];
  private ServerHealthMap: Map<ServerConfig, boolean> = new Map()
  private RequestsProcessed: Map<string, number> = new Map()
  private currentServer: number = 0;

  constructor(){
    console.log("LoadBalancer initialized!");
  }

  private setCurrentServer(){
    this.currentServer = this.currentServer + 1;
  }

  private getCurrentServer(){
    return this.currentServer
  }

  async addServers(path:string){
    console.log("adding servers....")
    try{
      const data = await fs.readFile(path,"utf8")
      if(data){
        const servers = data.split("\n")
        for(let i=0;i<servers.length;i++){
          this.availableServers.push({ url: servers[i], healthEndpoint: `${servers[i]}health`})   
        }   
        return 
      }else{
        console.log("no Servers available...")
        return
      }      
    }catch(err:any){
      console.log(err)
      return
    }
  }

  async routeRequests(req:IncomingMessage, res: ServerResponse){ 
    if(this.availableServers.length == 0){
      return "No available servers"
    } 
    let attempts = 0;
    while(attempts < this.availableServers.length){
      try{
        const response = await axios({
          method: req.method,
          url: this.availableServers[this.currentServer].url + req.url,
          timeout: 5000
        })
        if(!this.RequestsProcessed.has(this.availableServers[this.currentServer].url)){
          this.RequestsProcessed.set(this.availableServers[this.currentServer].url, 1)
        }
        const count = this.RequestsProcessed.get(this.availableServers[this.currentServer].url)
        if(count){
          this.RequestsProcessed.set(this.availableServers[this.currentServer].url, count+1)
        }        
        this.setCurrentServer()
        console.log("Requests processed :")
        console.log(this.RequestsProcessed)        
        return response.data
      }catch(err:any){
        console.log("error: ", err.response)
        attempts++
        this.setCurrentServer()
        if(attempts >= this.availableServers.length){
          console.log("No more servers available")
          this.currentServer = 0
          return "No more servers available"
        }         
      }
    }
    
  }

  async checkAllServers(){
    if(this.availableServers.length == 0){
      return "No available Servers"
    }
    console.log("checking all servers.....")

    for(let i=0;i<this.availableServers.length;i++){
      if(await this.checkHealthStatus(this.availableServers[i].url) == false){
        console.log(`${this.availableServers[i].url} down`)
        this.ServerHealthMap.set(this.availableServers[i], false)
        this.unavailableServers.push(this.availableServers[i].url)
      }else{
        console.log(`${this.availableServers[i].url} up`)
        this.ServerHealthMap.set(this.availableServers[i], true)
      }   
    }
    return
  }

  async checkUnavailableServers(){
    console.log("checking all unavaiable servers.......")
    if(this.availableServers.length == 0){
      return "All servers are up"
    }
    for(let i =0;i<this.unavailableServers.length;i++){
      if(await this.checkHealthStatus(this.unavailableServers[i]) == true){
        console.log(`${this.unavailableServers[i]} rebuked`)
        this.ServerHealthMap.set({url: this.unavailableServers[i], healthEndpoint: `${this.unavailableServers[i]}health`}, true)
      }    
    }
    console.log(this.ServerHealthMap)
  }  

  private async checkHealthStatus(arr: string){
    try{       
      const answer = await axios({
        method: 'GET',
        url: arr + "/health",
        timeout: 5000
      })
      return answer.status === 200
    }
    catch(err){
      return false
    }
  }
}

module.exports =  LoadBalancer 