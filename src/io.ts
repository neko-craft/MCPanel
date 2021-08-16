import socketIO from 'socket.io-client'

export default socketIO('https://nekocraft.apisium.cn', { path: '/NekoPanel' })
