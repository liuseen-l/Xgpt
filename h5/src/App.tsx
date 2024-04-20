function App() {
  const createTime = location.search.slice(1).split('=')[1]

  const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4'!)
    .then(FingerprintJS => FingerprintJS.load())

  // 拿到浏览器id,生成设备id,登陆时一起传过去

  const handleClick = () => {
    fpPromise
      .then(fp => fp.get())
      .then((result) => {
        const did = result.visitorId
        // 点击授权按钮
        fetch(`http://124.71.110.30:8080/user/login/by/scan?&did=${did}&createTime=${createTime}`, {
          method: 'Get',
        }).then(res => res.json()).then((_res) => {
        }).catch((_err) => {
        })
      })
  }

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

export default App
