const express = require('express')
const qrcode = require('qrcode')

const app = express()

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

app.use(express.json())
app.use('/static', express.static('public/app'))
app.use('/assets', express.static('public/assets'))
app.get('/qrcode', async (req, res) => {
  const createTime = req.query.createTime
  const code = await qrcode.toDataURL(`http://124.71.110.30:3000/static/index.html?createTime=${createTime}`)
  res.json({
    code,
  })
})

app.listen(3000, () => {
  console.log('http://localhost:3000')
})
