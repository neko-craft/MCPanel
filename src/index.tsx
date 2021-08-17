/* eslint-disable no-restricted-globals */
import 'antd/dist/antd.css'
import 'dayjs/locale/zh-cn'
import './index.css'
import dayjs from 'dayjs'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import zhCN from 'antd/es/locale/zh_CN'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ConfigProvider } from 'antd'

dayjs.locale('zh-cn')
dayjs.extend(duration)
dayjs.extend(relativeTime)

ReactDOM.render(<ConfigProvider locale={zhCN}><App /></ConfigProvider>, document.getElementById('root'))
