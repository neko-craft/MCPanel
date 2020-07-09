import './Maps.css'
import React from 'react'
import { Card } from 'antd'

const text = { __html: require('../assets/about_content.md') }

const About: React.FC = () => {
  return (
    <div style={{ overflowY: 'auto', padding: 16 }}>
      <Card hoverable style={{ cursor: 'default' }}><div dangerouslySetInnerHTML={text} /></Card>
    </div>
  )
}

export default About
