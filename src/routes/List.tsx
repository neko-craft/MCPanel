import './List.css'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, List, Avatar, Popover, Button, Tag, Table } from 'antd'
import socket from '../io'

export interface PlayerInfo {
  banned?: boolean
  lastLogin: number
  lastLoginText: string
  name: string
  isOp?: boolean
  firstPlayed: number
  firstPlayedText: string
  onlineTime: number
  onlineTimeText: string
}

interface BanInfo {
  name: string
  reason: string
  from: string
  to?: string
  source: string
}

const columns = [
  {
    title: '游戏名',
    dataIndex: 'name',
    render: (it: string, p: PlayerInfo) => (
      <>
        <Avatar
          shape='square'
          size='large'
          src={`https://minotar.net/helm/${it}/40.png`}
        />&nbsp;&nbsp;{it} {p.isOp && <Tag color='geekblue'>管理员</Tag>}{p.banned && <Tag color='red'>已被封禁</Tag>}
      </>
    )
  },
  {
    title: '在线时间',
    dataIndex: 'onlineTimeText',
    sorter: (a: PlayerInfo, b: PlayerInfo) => b.onlineTime - a.onlineTime
  },
  {
    title: '最后登录',
    dataIndex: 'lastLoginText',
    sorter: (a: PlayerInfo, b: PlayerInfo) => b.lastLogin - a.lastLogin
  },
  {
    title: '注册时间',
    dataIndex: 'firstPlayedText',
    sorter: (a: PlayerInfo, b: PlayerInfo) => b.firstPlayed - a.firstPlayed
  }
]

const ListPage: React.FC = () => {
  const [list, setList] = useState<PlayerInfo[]>([])
  const [banList, setBanList] = useState<BanInfo[]>([])
  useEffect(() => {
    socket.emit('list', (listJson: string, banListJson: string) => {
      const banList1: BanInfo[] = JSON.parse(banListJson).sort((a: any, b: any) => b.from - a.from)
      const obj: Record<string, null> = { }
      banList1.forEach(it => {
        obj[it.name] = null
        it.from = dayjs(it.from).format('LLLL')
        if (it.to) it.to = dayjs(it.to).format('LLLL')
      })
      const list1: PlayerInfo[] = JSON.parse(listJson)
      list1.forEach(it => {
        it.lastLoginText = dayjs(it.lastLogin).format('YYYY/MM/DD HH:mm:ss')
        it.firstPlayedText = dayjs(it.firstPlayed).format('YYYY/MM/DD HH:mm:ss')
        it.onlineTimeText = dayjs.duration(it.onlineTime / 20, 'seconds').humanize()
        if (it.name in obj) it.banned = true
      })
      setList(list1)
      setBanList(banList1)
    })
  }, [])

  return (
    <Row id='list' className='mcp-content' gutter={16}>
      <Col span={24} sm={12}>
        <Card title='封禁列表' className='card'>
          <List
            pagination={{ defaultPageSize: 30, pageSizeOptions: ['30', '50', '100'], style: { marginBottom: 20 } }}
            itemLayout='horizontal'
            dataSource={banList}
            renderItem={it => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape='square'
                      size='large'
                      src={`https://minotar.net/helm/${it.name}/40.png`}
                    />
                  }
                  title={<>{it.name} {!it.to && <Tag color='red'>永久封禁</Tag>}</>}
                  description={(
                    <>{it.reason}<Popover content={(<>
                      <p>封禁者: {it.source}</p>
                      <p>封禁时间: {it.from}</p>
                      <p>解除时间: {it.to || '无'}</p>
                    </>)}><Button type='link'>查看更多</Button></Popover></>
                  )}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={24} sm={12}>
        <Card title='玩家列表' className='card players'>
          <Table
            rowKey='name'
            columns={columns}
            dataSource={list}
            scroll={{ x: 'max-content' }}
            pagination={{ defaultPageSize: 30, pageSizeOptions: ['30', '50', '100'], style: { marginRight: 16 } }}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default ListPage
