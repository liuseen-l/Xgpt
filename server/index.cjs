const express = require('express')
const qrcode = require('qrcode')

const app = express()

app.all('*', (req, res, next) => {
  // 跨域交流cookie，origin必须指定
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use(express.json())
app.use('/static', express.static('./server/dist/h5')) // 初始化静态目录
app.use('/assets', express.static('./server/dist/assets')) // 初始化静态目录
// 初始化数据结构 记录用户和创建二维码的时间
// 并且生成二维码的时候使用的是授权的那个页面并且把用户id带过去
app.get('/qrcode', async (req, res) => {
  const createTime = req.query.createTime
  const code = await qrcode.toDataURL(`http://10.200.53.179:3000/static/index.html?createTime=${createTime}`)
  res.json({
    code,
  })
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
