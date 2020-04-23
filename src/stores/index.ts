import { message } from 'antd'
import { newInstance, NOT_PROXY } from 'reqwq'
import Home from './Home'
import Chat from './Chat'
import Login from './Login'
import List from './List'

const socket: { s: WebSocket, [NOT_PROXY]: true } = { s: null, [NOT_PROXY]: true }
const Provider = newInstance(new Home(), new Login(socket), new Chat(socket), new List(socket))

const homeModel = Provider.getStore(Home)
const chatModel = Provider.getStore(Chat)
const loginModel = Provider.getStore(Login)
const listModel = Provider.getStore(List)

const mapping = {
  status: homeModel.setStatus,
  chat: chatModel.receive,
  login: loginModel.loginReceive,
  token: loginModel.tokenReceive,
  playerJoin: chatModel.playerJoin,
  playerQuit: chatModel.playerQuit,
  list: listModel.listReceive,
  quit: loginModel.quitReceive,
  dialog: (d: any) => message[d.kind](d.message, 5)
}

const f = () => {
  const close = message.loading('连接服务器中...')
  socket.s = new WebSocket('ws://hz.apisium.cn:9124/ws')
  socket.s.onmessage = ({ data }) => {
    if (!data) return
    const d = JSON.parse(data)
    if (d.type) {
      if (d.type in mapping) mapping[d.type](d)
      else console.error(d.type, '没有对应的操作!')
    }
  }

  socket.s.onopen = () => {
    close()
    const token = localStorage.getItem('token')
    if (token) loginModel.checkToken(token)
  }

  socket.s.onclose = () => {
    message.error('连接已断开!')
    setTimeout(f, 5000)
  }
}
f()

export default Provider
