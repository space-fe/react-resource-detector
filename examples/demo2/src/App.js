import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { routeResourceDetector } from 'react-resource-detector'

const { RouteResourceConsumer } = routeResourceDetector

function Index() {
  return <h2>Home</h2>
}

function About() {
  return <h2>About</h2>
}

function Users() {
  return (
    <>
      <h2>Users</h2>
      <RouteResourceConsumer>
        {
          state => {
            console.log('state => ', state)
            const { user = {} } = state

            return <div>{`${user.name}: ${user.display_name}`}</div>
          }
        }
      </RouteResourceConsumer>
    </>
  )
}

function AppRouter() {
  const routeConfig = [
    {
      type: 'about',
      regexp: /about/i,
      select: () => {
        console.log('about')
      }
    },
    {
      type: 'user',
      regexp: /users/i,
      select: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              name: 'user1',
              display_name: 'mo'
            })
          }, 1000)
        })
      }
    },
    {
      type: 'test',
      regexp: /users/i,
      detect: (_, matchResult) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({
              test: 'test'
            })
          }, 500)
        })
      }
    }
  ]

  const RouteResourceProvider = routeResourceDetector(routeConfig)

  return (
    <Router>
      <RouteResourceProvider>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about/">About</Link>
          </li>
          <li>
            <Link to="/users/">Users</Link>
          </li>
        </ul>

        <Route path="/" exact component={Index} />
        <Route path="/about/" component={About} />
        <Route path="/users/" component={Users} />
      </RouteResourceProvider>
    </Router>
  )
}

class App extends React.PureComponent {
  render () {
    return (
      <div className="App">
        test
        <AppRouter />
      </div>
    )
  }
}

export default App
