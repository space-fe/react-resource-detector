import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { routeResourceDetector } from 'react-resource-detector'
import './App.css'

function Index() {
  return <h2>Home</h2>
}

function About() {
  return <h2>About</h2>
}

function Users() {
  return <h2>Users</h2>
}

function AppRouter() {
  return (
    <Router>
      <div>
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
      </div>
    </Router>
  )
}

function App() {
  return (
    <div className="App">
      test
      <AppRouter />
    </div>
  )
}

export default App
