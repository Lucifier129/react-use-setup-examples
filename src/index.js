import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { reactive, useSetup } from './use-setup'
import useHashChange from './hooks/useHashChange'
import demos from './demos'

const setupApp = () => {
  let route = reactive({
    value: ''
  })

  route.update = name => {
    route.value = name
  }

  return route
}

function App() {
  let route = useSetup(setupApp)

  useHashChange(() => {
    route.update(window.location.hash.slice(1))
  })

  useEffect(() => {
    let name = window.location.hash.slice(1)
    if (name) route.update(name)
  }, [])

  let Target = demos[route.value] || null

  return (
    <>
      <h1>
        <a href="#">Index</a>
      </h1>
      {!!Target && (
        <Suspense fallback="loading...">
          <Target />
        </Suspense>
      )}
      {!Target &&
        Object.keys(demos).map(name => {
          return (
            <div key={name}>
              <a href={`#${name}`}>{name}</a>
            </div>
          )
        })}
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
