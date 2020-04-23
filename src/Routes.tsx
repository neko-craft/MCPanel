import React from 'react'
import { Menu } from 'antd'
import { useLocation } from 'react-router'
import { Switch, Link, Redirect, Route } from 'react-router-dom'

import HomeOutlined from '@ant-design/icons/HomeOutlined'
import CompassOutlined from '@ant-design/icons/CompassOutlined'
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined'
import QuestionOutlined from '@ant-design/icons/QuestionOutlined'

import Home from './routes/Home'
import Maps from './routes/Maps'
import List from './routes/List'
import About from './routes/About'

const routes: Array<{ path: string, icon: any, name: string, component: any }> = [
  {
    path: '/home',
    icon: HomeOutlined,
    name: '主页',
    component: Home
  },
  {
    path: '/maps',
    icon: CompassOutlined,
    name: '地图',
    component: Maps
  },
  {
    path: '/list',
    icon: UnorderedListOutlined,
    name: '封禁与白名单',
    component: List
  },
  {
    path: '/about',
    icon: QuestionOutlined,
    name: '萌新必看',
    component: About
  }
]

const routeMapped = routes.map(args => <Route key={args.path} {...args} />)
const Routes: React.FC = () => (
  <Switch>
    {routeMapped}
    <Redirect to='/home' />
  </Switch>
)

const routeMenus = routes.map(({ path, name, icon: Icon }) => (
  <Menu.Item key={path}>
    <Link to={path}>
      <Icon />
      <span>{name}</span>
    </Link>
  </Menu.Item>
))

const Menus: React.FC<{ theme?: undefined | 'dark' }> = ({ theme }) => {
  return <Menu theme={theme} mode='inline' selectedKeys={[useLocation().pathname]}>{routeMenus}</Menu>
}

export { Menus, Routes }
