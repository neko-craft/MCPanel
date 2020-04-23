import { Store, NOT_PROXY } from 'reqwq'

interface PlayerStatus {
  name: string
  health: number
  food: number
  fishing: boolean
}

export default class Home extends Store {
  public players: PlayerStatus[] = []
  public tps = 20

  public setStatus (json: { players: PlayerStatus[], tps: number }) {
    this.players = Object.defineProperty(json.players, NOT_PROXY, { value: true })
    this.tps = json.tps
  }
}
