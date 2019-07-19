declare interface IConfig {
  serve: string
  keys: string[]
  session: {
    key: string
  }
}

declare interface IMessage {
  message: string
  type: MSG_TYPE
  timestamp: number
}