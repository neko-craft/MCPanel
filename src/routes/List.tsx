import './List.css'
import React, { useEffect } from 'react'
import ListModel, { PlayerInfo } from '../states/List'
import { useModel } from '../state'
import { Row, Col, Card, List, Avatar, Popover, Button, Tag, Table } from 'antd'

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
        />&nbsp;&nbsp;{it} {p.op && <Tag color='geekblue'>管理员</Tag>}{p.banned && <Tag color='red'>已被封禁</Tag>}
      </>
    )
  },
  {
    title: '最后登录',
    dataIndex: 'loginTimeText',
    sorter: (a: PlayerInfo, b: PlayerInfo) => a.loginTime - b.loginTime
  },
  {
    title: '注册时间',
    dataIndex: 'registerTimeText',
    sorter: (a: PlayerInfo, b: PlayerInfo) => a.registerTime - b.registerTime
  }
]

const ListPage: React.FC = () => {
  const store = useModel(ListModel)
  useEffect(store.getList, [])
  return (
    <Row id='list' className='mcp-content' gutter={16}>
      <Col span={24} sm={12}>
        <Card title='封禁列表' className='card'>
          <List
            itemLayout='horizontal'
            dataSource={store.banList}
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
                    </>)}>
                    <Button type='link'>查看更多</Button></Popover></>)}
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
          dataSource={store.players}
          scroll={{ x: 'max-content' }}
          pagination={false}
        />
      </Card>
      </Col>
    </Row>
  )
}

export default ListPage
