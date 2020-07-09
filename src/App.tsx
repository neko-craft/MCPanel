import './App.css'
import React, { useState } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { Typography, Layout, Drawer, BackTop } from 'antd'
import { Menus, Routes } from './Routes'
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined'
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined'
import Login from './components/Login'

const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const [collapsed, updateCollapsed] = useState(window.innerWidth < 992)
  const [drawer, updateDrawer] = useState(false)

  return (
    <Router>
      <Layout id='mcp-app'>
        <Sider
          style={{ display: drawer ? 'none' : '' }}
          trigger={null}
          collapsible
          breakpoint='lg'
          onBreakpoint={updateDrawer}
          collapsedWidth='0'
          collapsed={collapsed}
        >
          <div id='mcp-logo' />
          <Menus theme='dark' />
        </Sider>
        <Drawer
          title={<div id='mcp-logo' />}
          className='no-padding'
          placement='left'
          closable={false}
          onClose={() => updateCollapsed(true)}
          visible={drawer && !collapsed}
        >
          <Menus />
        </Drawer>
        <Layout>
          <Header style={{
            background: '#fff',
            padding: 0,
            position: 'fixed',
            width: '100%',
            zIndex: 1
          }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              { className: 'trigger', onClick () { updateCollapsed(!collapsed) } } as any)}
            <Typography.Title level={3}>NekoCraft</Typography.Title>
          </Header>
          <Login />
          <Content
            style={{
              minHeight: 280,
              marginTop: 64
            }}
          >
            <BackTop />
            <Routes />
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App
