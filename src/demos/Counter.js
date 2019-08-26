import React, { useEffect } from 'react'
import { reactive, useSetup } from '../use-setup'
import useSessionStorage from '../hooks/useSessionStorage'

const setupCounter = (initValue = 0) => {
  let state = reactive({ count: initValue })
  let actions = {
    merge(newState) {
      Object.assign(state, newState)
    },
    incre() {
      state.count += 1
    },
    decre() {
      state.count -= 1
    }
  }

  return [state, actions]
}

export default function Counter() {
  let [state, actions] = useSetup(setupCounter)

  useSessionStorage({
    key: 'counter-json',
    getter: () => state,
    setter: actions.merge
  })

  useEffect(() => {
    let timer = setInterval(actions.incre, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div>
      <button onClick={actions.incre}>+1</button>
      {state.count}
      <button onClick={actions.decre}>-1</button>
    </div>
  )
}
