/* eslint-disable react/jsx-curly-newline */
import './Chat.css'
import TimeAgo from 'timeago-react'
import SendIcon from './SendIcon'
import MessageTwoTone from '@ant-design/icons/MessageTwoTone'
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Badge, Drawer, Input, Avatar, Card, Tag, message } from 'antd'
import socket from '../io'

const Chat: React.FC<{ playerName?: string, banned: boolean }> = ({ playerName, banned }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const ref2 = useRef<string>()
  ref2.current = playerName
  const [visible, _setVisible] = useState(false)
  const [hasNew, setHasNew] = useState(0)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const messages = useMemo<JSX.Element[]>(() => [], [])
  const update = useState(0)

  const setVisible = (value: boolean) => {
    setHasNew(0)
    if (value) process.nextTick(() => ref.current && (ref.current.scrollTop = ref.current.scrollHeight))
    _setVisible(value)
  }
  useEffect(() => {
    const scroll = () => {
      const dom = ref.current
      if (dom && dom.scrollTop === dom.scrollHeight - dom.clientHeight) {
        process.nextTick(() => (dom.scrollTop = dom.scrollHeight))
      }
    }
    let i = 0
    const fn0 = (action: string, name: string, message?: string) => {
      switch (action) {
        case 'chat':
          messages.push(<div key={i} className={ref2.current === name ? 'right' : undefined}>
            <Avatar
              shape='square'
              size='large'
              src={`https://minotar.net/helm/${name}/40.png`}
            />
            <Card>
              <p className='name'>{name}</p>{message}&nbsp;&nbsp;&nbsp;&nbsp;
              <TimeAgo className='time' datetime={Date.now()} locale='zh_CN' />
            </Card>
          </div>)
          setHasNew(1)
          break
        case 'join':
          messages.push(<div key={i} className='tag'><Tag>{name} 进入了服务器</Tag></div>)
          break
        case 'quit':
          messages.push(<div key={i} className='tag'><Tag>{name} 离开了服务器</Tag></div>)
          break
        case 'death':
          messages.push(<div key={i} className='tag'><Tag>{name} 去世了</Tag></div>)
      }
      scroll()
      update[1](++i)
    }
    socket.on('playerAction', fn0)
    return () => void socket.off('playerAction', fn0)
  }, [])

  return (
    <>
      <Badge className='chat-icon' count={hasNew} dot>
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
        <div className='messages' ref={ref}>{messages}</div>
        {playerName
          ? banned
            ? <Input.Search placeholder='你已被封禁!' disabled enterButton={<SendIcon />} />
            : <Input.Search
              disabled={loading}
              loading={loading}
              placeholder='请输入聊天内容...'
              onSearch={() => {
                setLoading(true)
                setText('')
                socket.emit('chat', text, (err?: string) => {
                  if (err) message.error(err, 5)
                  setLoading(false)
                })
              }}
              value={text}
              onChange={it => setText(it.target.value)}
              enterButton={<SendIcon />}
            />
          : <Input.Search placeholder='你还没有登录!' disabled enterButton={<SendIcon />} />
        }
      </Drawer>
    </>
  )
}

export default Chat
