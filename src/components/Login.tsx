import React, { useState } from 'react'
import useForm from 'rc-form-hooks'
import LoginModel from '../states/Login'
import HomeModel from '../states/Home'
import { useModel } from '../state'
import { Avatar, Menu, Modal, Steps, Icon, Form, Input,
  Button, Spin, Result, Tooltip, Row, Col, Select, Dropdown } from 'antd'

const { Step } = Steps
const { Item } = Form

/* eslint-disable jsx-a11y/anchor-is-valid */

const Login: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const store = useModel(LoginModel)
  const { players } = useModel(HomeModel)
  const { getFieldDecorator, validateFields } = useForm<{
    userName: string
    name: string
  }>()
  const closeModel = () => setVisible(false)

  return (
    <>
      {store.token
        ? (<Dropdown overlay={(<Menu>
              <Menu.Item key='0' disabled>用户名: {store.name}</Menu.Item>
              <Menu.Item key='2' disabled>{store.banned ? '已被封禁' : '状态正常'}</Menu.Item>
              <Menu.Divider />
              <Menu.Item key='1'>
                <a onClick={store.quit}>退出登录</a>
              </Menu.Item>
            </Menu>)} placement='bottomRight'>
            <Avatar
              className='head'
              shape='square'
              size='large'
              src={`https://minotar.net/helm/${store.name}/40.png`}
            />
          </Dropdown>)
        : (<Tooltip placement='bottomLeft' title='点击这里以登录' defaultVisible>
          <Avatar
            {...({ onClick: () => {
              store.setStep(0)
              setVisible(true)
            } } as any)}
            className='head'
            shape='square'
            size='large'
            icon='user'
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
        <Steps current={store.step} style={{ textAlign: 'left', marginBottom: 20 }}>
          <Step title='输入信息' icon={<Icon type='user' />} />
          <Step title='验证' icon={<Icon type='solution' />} />
          <Step title='完成' icon={<Icon type='smile-o' />} />
        </Steps>
        {store.step === 0
          ? (<Form
              onSubmit={e => {
                e.preventDefault()
                store.login(validateFields)
              }}
            >
              <Row gutter={12}>
                <Col span={24} md={10}>
                  <Item hasFeedback>
                    {getFieldDecorator('userName', {
                      rules: [
                        { required: true, message: '请选择你的游戏名!' }
                      ]
                    })(<Select
                        disabled={store.loginLoading}
                        placeholder='请选择你的游戏名'
                      >
                      {players.map(it => <Select.Option key={it.name} value={it.name}>{it.name}</Select.Option>)}
                    </Select>
                    )}
                  </Item>
                </Col>
                <Col span={24} md={10}>
                  <Item hasFeedback>
                    {getFieldDecorator('name', {
                      rules: [
                        { required: true, message: '请输入当前设备标识!' },
                        { min: 2, message: '设备标识不能少于2位!' },
                        { max: 16, message: '设备标识不能大于16位!' }
                      ]
                    })(<Input
                      disabled={store.loginLoading}
                      prefix={<Icon type='flag' style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder='设备标识'
                    />)}
                  </Item>
                </Col>
                <Col span={24} md={2}>
                  <Item>
                    <Button type='primary' htmlType='submit' loading={store.loginLoading}>登录</Button>
                  </Item>
                </Col>
                <Col span={24}>
                  <Item extra='请登入MC服务器再进行操作.' />
                </Col>
              </Row>
            </Form>)
          : store.step === 1 ? <Spin tip='请您进入NekoCraft服务器, 根据游戏中的提示完成验证' /> : <Result
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
