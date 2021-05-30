/* eslint-disable no-restricted-globals */
import 'antd/dist/antd.css'
import 'moment/locale/zh-cn'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import zhCN from 'antd/es/locale/zh_CN'
import * as moment from 'moment'
import { ConfigProvider } from 'antd'

moment.locale('zh')

ReactDOM.render(<ConfigProvider locale={zhCN}><App /></ConfigProvider>, document.getElementById('root'))
