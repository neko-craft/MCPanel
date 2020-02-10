import 'moment/locale/zh-cn'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import zhCN from 'antd/es/locale/zh_CN'
import * as moment from 'moment'
import * as serviceWorker from './serviceWorker'
import { ConfigProvider } from 'antd'

const dom = document.getElementById('root')
if (!('WebSocket' in window) || !('Proxy' in window) || !('fetch' in window)) {
  dom.innerHTML = '您的设备不支持显示本页面, 请更新至最新版的 Chrome 以获得最佳体验!'
} else {
  if (window.location.protocol === 'https:') {
    window.location.protocol = 'http:'
  }
  moment.locale('zh')

  ReactDOM.render(<ConfigProvider locale={zhCN}><App /></ConfigProvider>, dom)

  serviceWorker.register()
}
