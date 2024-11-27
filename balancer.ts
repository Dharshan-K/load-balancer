const axios = require('axios')
const http = require("http")

class LoadBalancer{
  private availableServers: ServerConfig[] = [];
  private unavailableServers: ServerConfig[] = [];
  private ServerHealthMap: Map<ServerConfig, boolean> = new Map()

  async routeRequests(){
    if(this.availableServers.length == 0){
      return "No available servers"
    }    

    const currentServer = this.availableServers.shift();
    if(currentServer){
      this.availableServers.push(currentServer)
    }
    await axios({
      method: 'GET',
      url: currentServer?.url
    }).then((response:any)=>{      
      return response
    })

  }

  async checkAllServers(){
    if(this.availableServers.length == 0){
      return "No available Servers"
    }

    for(let i=0;i<this.availableServers.length;i++){
      if(await this.checkHealthStatus(this.availableServers[i]) == false){
        this.unavailableServers.push(this.availableServers[i])
        this.ServerHealthMap.set(this.availableServers[i], false)
        this.availableServers.splice(i,1)
        break
      }
      this.ServerHealthMap.set(this.availableServers[i], true)      
    }
  }

  async checkUnavailableServers(){
    if(this.availableServers.length == 0){
      return "All servers are up"
    }

    for(let i=0;i< this.unavailableServers.length;i++){
      if(await this.checkHealthStatus(this.unavailableServers[i]) == true){
        this.availableServers.push(this.unavailableServers[i]);
        this.ServerHealthMap.set(this.availableServers[i], true)
        this.unavailableServers.splice(i,1);
      }
    }
  }  

  private async checkHealthStatus(arr: ServerConfig){
    try{
      await axios({
        method: 'GET',
        url: arr.healthEndpoint
      })
      return true
    }catch(err){
      return false
    }
  }

}