import React from 'react'
import useReactRouter from 'use-react-router'
import { Menu, Icon } from 'antd'
import { Switch, Link, Redirect, Route } from 'react-router-dom'

import Home from './routes/Home'
import Maps from './routes/Maps'
import List from './routes/List'
import About from './routes/About'

const routes = [
  {
    path: '/home',
    icon: 'home',
    name: '主页',
    component: Home
  },
  {
    path: '/maps',
    icon: 'compass',
    name: '地图',
    component: Maps
  },
  {
    path: '/list',
    icon: 'unordered-list',
    name: '封禁与白名单',
    component: List
  },
  {
    path: '/about',
    icon: 'question',
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

const routeMenus = routes.map(({ path, icon, name }) => (
  <Menu.Item key={path}>
    <Link to={path}>
      <Icon type={icon} />
      <span>{name}</span>
    </Link>
  </Menu.Item>
))

const Menus: React.FC<{ theme?: undefined | 'dark' }> = ({ theme }) => {
  const { location: { pathname } } = useReactRouter()
  return <Menu theme={theme} mode='inline' selectedKeys={[pathname]}>{routeMenus}</Menu>
}

export { Menus, Routes }
