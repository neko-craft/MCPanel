/* eslint-disable react/jsx-curly-newline */
import './Chat.css'
import TimeAgo from 'timeago-react'
import SendIcon from './SendIcon'
import LoginModel from '../stores/Login'
import _MessageTwoTone from '@ant-design/icons/MessageTwoTone'
import ChatModel, { setDom } from '../stores/Chat'
import React, { useState, useRef } from 'react'
import { Badge, Drawer, Input, Avatar, Card, Tag } from 'antd'
import { useStore } from 'reqwq'

const MessageTwoTone: any = _MessageTwoTone

const Chat: React.FC = () => {
  const ref = useRef<HTMLDivElement>()
  const store = useStore(ChatModel)
  const login = useStore(LoginModel)
  const [visible, _setVisible] = useState(false)
  const setVisible = (value: boolean) => {
    store.clearState()
    if (value) {
      process.nextTick(() => {
        ref.current.scrollTop = ref.current.scrollHeight
        setDom(ref.current)
      })
    }
    _setVisible(value)
  }
  return (
    <>
      <Badge className='chat-icon' count={+store.hasNew} dot>
        <MessageTwoTone
          style={{ fontSize: '28px' }}
          onClick={() => setVisible(true)}
        />
      </Badge>
      <Drawer
        className='chat'
        width='100%'
        visible={visible}
        onClose={() => setVisible(false)}
      >
        <div className='messages' ref={ref}>
          {store.messages.map(it => {
            switch (it.type) {
              case 1: return <div key={it.time} className='tag'><Tag>{it.name} 加入了游戏</Tag></div>
              case 2: return <div key={it.time} className='tag'><Tag>{it.name} 离开了游戏</Tag></div>
              default: return (<div key={it.time} className={it.right ? 'right' : undefined}>
                <Avatar
                  shape='square'
                  size='large'
                  src={`https://minotar.net/helm/${it.name}/40.png`}
                />
                <Card>
                  <p className='name'>{it.name}</p>{it.message}&nbsp;&nbsp;&nbsp;&nbsp;
                  <TimeAgo className='time' datetime={it.time} locale='zh_CN' />
                </Card>
              </div>)
            }
          })}
        </div>
        {login.token
          ? login.banned
            ? <Input.Search placeholder='你已被封禁!' disabled enterButton={<SendIcon />} />
            : <Input.Search
              placeholder='请输入聊天内容...'
              onSearch={store.chat}
              value={store.value}
              onChange={store.setValue}
              enterButton={<SendIcon />}
            />
          : <Input.Search placeholder='你还没有登录!' disabled enterButton={<SendIcon />} />
        }
      </Drawer>
    </>
  )
}

export default Chat
