import './Home.css'
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, List, Avatar, Statistic, Typography, Tag } from 'antd'
import socket from '../io'

interface Player {
  name: string
  health: number
  food: number
  afk?: boolean
}

const Home: React.FC = () => {
  const [tps, setTps] = useState('20.00')
  const [players, setPlayers] = useState<Array<Player>>([])
  const [version, setVersion] = useState('加载中...')
  useEffect(() => {
    const fn = (json: string, tpsRec: number, ver: string) => {
      setTps((Math.round(tpsRec * 100) / 100).toFixed(2))
      setPlayers(JSON.parse(json))
      setVersion(ver)
    }
    socket.on('status', fn).emit('getStatus')
    return () => void socket.off('status', fn)
  }, [])

  return (
    <Row id='home' className='mcp-content' gutter={16}>
      <Col span={12} sm={6}>
        <Card hoverable>
          <Statistic
            className='address'
            title='服务器地址'
            value=''
            prefix={<Typography.Title copyable level={4}>neko-craft.com</Typography.Title>}
          />
        </Card>
      </Col>
      <Col span={12} sm={6}>
        <Card hoverable>
          <Statistic title='游戏版本' value={version} />
        </Card>
      </Col>
      <Col span={12} sm={6}>
        <Card hoverable>
          <Statistic title='在线玩家' value={players.length} />
        </Card>
      </Col>
      <Col span={12} sm={6}>
        <Card hoverable>
          <Statistic title='TPS' value={tps} />
        </Card>
      </Col>
      <Col span={24} sm={12}>
        <Card title='玩家列表' className='players' hoverable>
          <List
            itemLayout='horizontal'
            dataSource={players}
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
                  title={<>{item.name} {item.afk && <Tag>挂机中</Tag>}</>}
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
        <Card title='公告' hoverable>Hello, NekoCraft!</Card>
      </Col>
    </Row>
  )
}

export default Home
