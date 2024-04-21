import { useState } from 'react'

enum Status {
  WAIT,
  LOGIN,
  ERROR,
}

function App() {
  const [status, setStatus] = useState(Status.WAIT)
  const createTime = location.search.slice(1).split('=')[1]

  // 拿到浏览器id,生成设备id,登陆时一起传过去

  const handleClick = () => {
    const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4'!)
      .then(FingerprintJS => FingerprintJS.load())

    fpPromise
      .then(fp => fp.get())
      .then((result) => {
        const did = result.visitorId
        // 点击授权按钮
        fetch(`http://124.71.110.30:8080/user/login/by/scan?&did=${did}&createTime=${createTime}`, {
          method: 'Get',
        }).then(res => res.json()).then((res) => {
          if (res.data.loginStatus) {
            setStatus(Status.LOGIN)
            return
          }
          setStatus(Status.ERROR)
        }).catch((_err) => {
        })
      })
  }

  const render = () => {
    if (status === Status.WAIT) {
      return (
        <>
          <div>
            <button id="btn" onClick={handleClick} className="h-50px w-100%">同意授权</button>
          </div>
          <div>
            <button className="h-50px w-100%">拒绝授权</button>
          </div>
        </>
      )
    }
    if (status === Status.ERROR) {
      return (
        <>
          <div>二维码已经过期</div>
        </>
      )
    }
    if (status === Status.LOGIN) {
      return (
        <>
          <div>登录成功</div>
        </>
      )
    }
  }
  return (
    <>
      <div className="w-100vw h-100vh">
        {render()}
      </div>
    </>
  )
}

export default App
