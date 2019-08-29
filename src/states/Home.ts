import { Model } from '../state'

interface PlayerStatus {
  name: string
  health: number
  food: number
  fishing: boolean
}

export default class Home extends Model {
  public players: PlayerStatus[] = []
  public tps = 20

  public setStatus (json: { players: PlayerStatus[], tps: number }) {
    this.players = json.players
    this.tps = json.tps
  }
}
