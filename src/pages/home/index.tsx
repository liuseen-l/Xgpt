import { useEffect, useRef, useState } from 'react'

function Test({ f }) {
  const d = useRef(1)
  console.log(d.current)

  return (
    <div onClick={() => {
      d.current = d.current + 1
      console.log(d.current)
    }}
    >
      {d.current}
    </div>
  )
}

function Home() {
  const [l, setL] = useState(false)
  return (
    <div className="h-100vh w-100vw flex">
      <button onClick={() => {
        setL(!l)
      }}
      >
      </button>
      <Test f={l}></Test>
    </div>
  )
}

export default Home
