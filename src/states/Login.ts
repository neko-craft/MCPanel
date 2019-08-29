import { message, Modal } from 'antd'
import { Model } from '../state'
import { MessageType } from 'antd/lib/message'

const { confirm } = Modal

export default class Login extends Model {
  public token = ''
  public name = ''
  public banned = false
  public whiteList = false
  public needWhiteList = false
  public loginLoading = false
  public step = 0
  private cacheToken = ''
  private loading: MessageType
  private loading2: MessageType

  constructor (private socket = { s: new WebSocket('') }) {
    super()
  }

  public checkToken (token: string) {
    if (!token) return
    this.loading = message.loading('验证账户中...', 0)
    this.cacheToken = token
    this.socket.s.send(`token|{"token":"${token}"}`)
  }

  public tokenReceive (data: { error: string, name: string, banned: boolean,
    whiteList: boolean, needWhiteList: boolean }) {
    this.loading()
    if (data.error) {
      this.step = 0
      this.cacheToken = ''
      this.name = ''
      this.banned = false
      this.whiteList = false
      this.needWhiteList = false
      message.error(data.error, 5)
      localStorage.removeItem('token')
    } else {
      localStorage.setItem('token', this.token = this.cacheToken)
      this.cacheToken = ''
      this.name = data.name
      this.banned = data.banned
      this.whiteList = this.whiteList
      this.needWhiteList = this.needWhiteList
    }
  }

  public setLoginLoading (value: boolean) {
    this.loginLoading = value
  }

  public setStep (value: number) {
    this.step = value
  }

  public login (validateFields: () => Promise<any>) {
    this.setLoginLoading(true)
    validateFields()
      .then(data => {
        this.socket.s.send('login|' + JSON.stringify(data))
        this.setStep(1)
      })
      .catch(e => {
        console.error(e)
        message.error('发生错误!', 5)
        this.setStep(0)
      })
      .finally(() => this.setLoginLoading(false))
  }

  public loginReceive (data: { error: string, token: string }) {
    if (data.error) {
      this.step = 0
      message.error(data.error, 5)
    } else {
      this.step = 2
      this.checkToken(data.token)
    }
  }

  public quit () {
    confirm({
      title: '是否确认退出登录?',
      content: '如退出登录下次重新登录需要重新进入游戏确认, 同时本设备也会从你的记录中删除.',
      okType: 'danger',
      onOk: () => {
        this.loading2 = message.loading('退出登录中...')
        this.socket.s.send('quit|{"token":"' + this.token + '"}')
      }
    })
  }

  public quitReceive (data: { error: string, token: string }) {
    if (data.error) {
      message.error(data.error, 5)
      return
    }
    if (data.token !== this.token) return
    localStorage.removeItem('token')
    this.token = ''
    this.name = ''
    this.banned = false
    this.whiteList = false
    this.needWhiteList = false
    this.loading2()
    message.success('退出登录成功!', 5)
  }
}
