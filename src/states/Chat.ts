import LoginModel from './Login'
import { Model } from '../state'

interface Message {
  name: string
  message?: string
  time: number
  type?: number
  right?: boolean
}

let dom: HTMLDivElement

export const setDom = (d: HTMLDivElement) => (dom = d)

const scroll = () => {
  if (dom && dom.scrollTop === dom.scrollHeight - dom.clientHeight) {
    process.nextTick(() => (dom.scrollTop = dom.scrollHeight))
  }
}

export default class Chat extends Model {
  public messages: Message[] = []
  public hasNew = false
  public value = ''

  constructor (private socket = { s: new WebSocket('') }) { super() }

  public setValue (e: any) {
    this.value = e.target.value
  }

  public receive (json: { name: string, message: string }) {
    scroll()
    this.messages.push({
      name: json.name,
      message: json.message,
      time: Date.now(),
      right: this.getModel(LoginModel).name === json.name
    })
    this.hasNew = true
  }

  public clearState () {
    this.hasNew = false
  }

  public playerJoin (data: { name: string }) {
    scroll()
    this.messages.push({ name: data.name, type: 1, time: Date.now() })
  }

  public playerQuit (data: { name: string }) {
    this.messages.push({ name: data.name, type: 2, time: Date.now() })
  }

  public chat () {
    this.socket.s.send('chat|' + JSON.stringify({ message: this.value }))
    this.value = ''
  }
}
