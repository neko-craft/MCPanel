import socketIO from 'socket.io-client'

export default socketIO(process.env.NODE_ENV === 'production'
  ? location.protocol + '//hz.apisium.cn:9124' : 'http://127.0.0.1:9124')
