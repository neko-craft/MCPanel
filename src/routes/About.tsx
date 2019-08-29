import './Maps.css'
import React, { useState, useEffect } from 'react'
import { Spin, Card } from 'antd'
import Markdown from 'react-markdown'

const About: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState('')
  useEffect(() => void fetch('about.md')
    .then(it => it.text())
    .then(setData)
    .catch(console.error)
    .then(() => setLoading(false)), []
  )
  return (
    <div id='maps' style={{ overflowY: 'auto', padding: 16, height: loading ? '100%' : 'auto' }}>
      <Spin spinning={loading} size='large'>
        <Card hoverable><Markdown source={data} /></Card>
      </Spin>
    </div>
  )
}

export default About
