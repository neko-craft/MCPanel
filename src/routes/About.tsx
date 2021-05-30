import './Maps.css'
import React from 'react'
import Content from '../assets/about_content.mdx'
import { Card } from 'antd'

const About: React.FC = () => {
  return (
    <div style={{ padding: 16 }}>
      <Card hoverable style={{ cursor: 'default' }}><Content /></Card>
    </div>
  )
}

export default About
