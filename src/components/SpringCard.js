import React from 'react'
import { useSpring, animated } from 'react-spring'
import './Styles/SpringCard.css'

const calc = (x, y) => [-(y - window.innerHeight / 2) / 20, (x - window.innerWidth / 2) / 20, 1.1]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

function SpringCard(props) {
  const [propss, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 10, tension: 450, friction: 25 } }))
  return (
    <animated.div
      className="card"
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: propss.xys.interpolate(trans) }}
  >{props.children}</animated.div>
  )
}

export default SpringCard;