interface ServerConfig {
  url: string
  healthEndpoint: string
}

interface ServerStatus {
  status: status
  health: boolean
  recoveryAttempts: Number
}

enum status {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE'
}
