import './Home.css'
import React, { useEffect, useState } from 'react'
import HomeModel from '../stores/Home'

import Markdown from 'react-markdown'
import { useStore } from 'reqwq'
import { Row, Col, Card, List, Avatar, Statistic, Typography, Tag } from 'antd'

const Home: React.FC = () => {
  const [text, setText] = useState('')
  useEffect(() => void fetch('./notice.md').then(it => it.text()).then(setText).catch(console.error), [])
  const store = useStore(HomeModel)
  return (
    <Row id='home' className='mcp-content' gutter={16}>
      <Col span={12} sm={6}>
        <Card hoverable>
          <Statistic
            className='address'
            title='服务器地址'
            value=''
            prefix={<Typography.Title copyable level={4}>n.apisium.cn</Typography.Title>}
          />
        </Card>
      </Col>
      <Col span={12} sm={6}>
        <Card hoverable>
          <Statistic title='游戏版本' value='1.15.2' />
        </Card>
      </Col>
      <Col span={12} sm={6}>
        <Card hoverable>
          <Statistic title='在线玩家' value={store.players.length} />
        </Card>
      </Col>
      <Col span={12} sm={6}>
        <Card hoverable>
          <Statistic title='TPS' value={store.tps} precision={2} />
        </Card>
      </Col>
      <Col span={24} sm={12}>
        <Card title='玩家列表' className='players' hoverable>
          <List
            itemLayout='horizontal'
            dataSource={store.players}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      shape='square'
                      size='large'
                      src={`https://minotar.net/helm/${item.name}/40.png`}
                    />
                  }
                  title={<>{item.name} {item.fishing && <Tag>摸鱼中</Tag>}</>}
                  description={<>
                    <div className='health' />
                    <div className='health-full' style={{ width: item.health / 20 * 140 }} />
                    <div className='food' />
                    <div className='food-full' style={{ width: item.food / 20 * 140 }} />
                  </>}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={24} sm={12}>
        <Card title='公告' hoverable loading={!text}>
          <Markdown source={text} />
        </Card>
      </Col>
    </Row>
  )
}

export default Home
