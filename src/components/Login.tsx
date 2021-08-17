import React, { useState, useEffect } from 'react'
import Item from 'antd/es/form/FormItem'
import { Avatar, Menu, Modal, Steps, Form, Input, message,
  Button, Spin, Result, Tooltip, Row, Col, Select, Dropdown } from 'antd'
import Chat from './Chat'
import socket from '../io'

import UserOutlined from '@ant-design/icons/UserOutlined'
import SolutionOutlined from '@ant-design/icons/SolutionOutlined'
import SmileOutlined from '@ant-design/icons/SmileOutlined'
import FlagOutlined from '@ant-design/icons/FlagOutlined'
const { Step } = Steps
const { confirm } = Modal

const Login: React.FC = () => {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const [players, setPlayers] = useState<string[]>([])
  const [name, setName] = useState<string>()
  const [banned, setBanned] = useState(false)
  const [form] = Form.useForm()

  const closeModel = () => setVisible(false)
  const getInfo = () => {
    const token = localStorage.getItem('token')
    const uuid = localStorage.getItem('uuid')
    if (!token || !uuid) return
    socket.emit('token', uuid, token, (err: string | undefined, name: string, banned: boolean) => {
      if (err) {
        message.error(err, 5)
        localStorage.removeItem('token')
        localStorage.removeItem('uuid')
      } else {
        setName(name)
        setBanned(banned)
      }
    })
  }

  useEffect(() => {
    getInfo()
    const fn = (json: string) => setPlayers(JSON.parse(json).map((it: any) => it.name))
    const fn2 = (err: string | undefined, token: string, uuid: string) => {
      if (err) {
        message.error(err, 5)
        setStep(0)
      } else {
        localStorage.setItem('token', token)
        localStorage.setItem('uuid', uuid)
        getInfo()
        setStep(2)
      }
    }
    socket.on('status', fn).on('login', fn2).on('reconnect', getInfo)
    return () => void socket.off('status', fn).off('login', fn2).off('reconnect', getInfo)
  }, [])

  return (
    <>
      <Chat playerName={name} banned={banned} />
      {name
        ? (<Dropdown
          overlay={(<Menu>
            <Menu.Item key='0' disabled>用户名: {name}</Menu.Item>
            <Menu.Item key='2' disabled>{banned ? '已被封禁' : '状态正常'}</Menu.Item>
            <Menu.Divider />
            <Menu.Item key='1'>
              <a onClick={() =>
                confirm({
                  title: '是否确认退出登录?',
                  content: '如退出登录下次重新登录需要重新进入游戏确认, 同时本设备也会从你的记录中删除.',
                  okType: 'danger',
                  onOk: () => {
                    const fn = message.loading('退出登录中...')
                    socket.emit('quit', (err?: string) => {
                      fn()
                      if (err) message.error(err, 5)
                      else {
                        localStorage.removeItem('token')
                        localStorage.removeItem('uuid')
                        setName(undefined)
                        message.success('退出成功!')
                      }
                    })
                  }
                })}>退出登录</a>
            </Menu.Item>
          </Menu>)} placement='bottomRight'>
          <Avatar
            className='head'
            shape='square'
            size='large'
            src={`https://minotar.net/helm/${name}/40.png`}
          />
        </Dropdown>)
        : (<Tooltip placement='bottomLeft' title='点击这里以登录' defaultVisible>
          <Avatar
            {...({ onClick: () => {
              setStep(0)
              setVisible(true)
            } } as any)}
            className='head'
            shape='square'
            size='large'
            icon={<UserOutlined />}
          />
        </Tooltip>)
      }
      <Modal
        title='登录'
        visible={visible}
        onCancel={closeModel}
        footer={null}
        bodyStyle={{ textAlign: 'center' }}
      >
        <Steps current={step} style={{ textAlign: 'left', marginBottom: 20 }}>
          <Step title='输入信息' icon={<UserOutlined />} />
          <Step title='验证' icon={<SolutionOutlined />} />
          <Step title='完成' icon={<SmileOutlined />} />
        </Steps>
        {step === 0
          ? (<Form
            form={form}
            onFinish={({ name, device }) => {
              setStep(1)
              socket.emit('login', name, device, (err?: string) => {
                if (!err) return
                message.error(err, 5)
                setStep(0)
              })
            }}
          >
            <Row gutter={12}>
              <Col span={24} md={10}>
                <Item hasFeedback name='name' rules={[{ required: true, message: '请选择你的游戏名!' }]}>
                  <Select placeholder='请选择你的游戏名'>
                    {players.map(it => <Select.Option key={it} value={it}>{it}</Select.Option>)}
                  </Select>
                </Item>
              </Col>
              <Col span={24} md={10}>
                <Item
                  hasFeedback
                  name='device'
                  rules={[
                    { required: true, message: '请输入当前设备名!' },
                    { min: 1, message: '设备名不能少于1位!' },
                    { max: 16, message: '设备名不能大于16位!' }
                  ]}
                >
                  <Input
                    prefix={<FlagOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder='给当前设备起个名字'
                  />
                </Item>
              </Col>
              <Col span={24} md={2}>
                <Item>
                  <Button type='primary' htmlType='submit' disabled={!players.length}>登录</Button>
                </Item>
              </Col>
              <Col span={24}>
                <Item extra='请登入MC服务器再进行操作.'><></></Item>
              </Col>
            </Row>
          </Form>)
          : step === 1
            ? <Spin tip='请您进入NekoCraft服务器, 根据游戏中的提示完成验证' />
            : <Result
              status='success'
              title='成功登录!'
              extra={[<Button type='primary' key='0' onClick={closeModel}>返回</Button>]}
            />
        }
      </Modal>
    </>
  )
}

export default Login
