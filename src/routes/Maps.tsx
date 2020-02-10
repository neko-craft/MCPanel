import './Maps.css'
import React, { useState } from 'react'
import { Spin } from 'antd'

const Maps: React.FC = () => {
  const [loading, setLoading] = useState(true)
  return (
    <div id='maps'>
      <Spin spinning={loading} size='large'>
        <iframe
          onLoad={() => setLoading(false)}
          title='NekoCraft | 网页地图'
          width='100%'
          height='100%'
          frameBorder='none'
          src='http://hz.apisium.cn:9123'
        />
      </Spin>
    </div>
  )
}

export default Maps
