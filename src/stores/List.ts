import { Store, NOT_PROXY } from 'reqwq'
import moment from 'moment'

export interface PlayerInfo {
  banned: boolean
  loginTime: number
  loginTimeText: string
  name: string
  op: boolean
  registerTime: number
  registerTimeText: string
  whiteList: boolean
}

interface BanInfo {
  name: string
  reason: string
  from: string
  to?: string
  source: string
}

export default class List extends Store {
  public players: PlayerInfo[] = []
  public banList: BanInfo[] = []

  constructor (private socket = { s: new WebSocket('') }) { super() }

  public getList () {
    if (this.socket.s.readyState === this.socket.s.CONNECTING) {
      const f = () => {
        this.socket.s.send('list|')
        this.socket.s.removeEventListener('open', f)
      }
      this.socket.s.addEventListener('open', f)
    } else this.socket.s.send('list|')
  }

  public listReceive (data: { players: PlayerInfo[], ban: BanInfo[] }) {
    const p = { }
    data.players.forEach(it => {
      it.loginTimeText = moment(it.loginTime).format('YYYY/MM/DD HH:mm:ss')
      it.registerTimeText = moment(it.registerTime).format('YYYY/MM/DD HH:mm:ss')
      p[it.name] = it
    })
    this.players = Object.defineProperty(Object.values(p), NOT_PROXY, { value: true })
    this.banList = Object.defineProperty(data.ban.map(it => ({
      name: it.name,
      reason: it.reason,
      from: moment(it.from).format('LLLL'),
      to: it.to && moment(it.to).format('LLLL'),
      source: it.source
    })), NOT_PROXY, { value: true })
  }
}
