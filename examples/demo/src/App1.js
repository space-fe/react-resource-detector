import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { routeResourceDetector } from 'react-resource-detector'

const { RouteResourceConsumer } = routeResourceDetector

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
function RouteWithSubRoutes (route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  )
}

function Resource2 () {
  return <h2>Sandwiches</h2>
}

function Resource1 ({ routes }) {
  return (
    <div>
      <h2>Resource1</h2>
      <ul>
        <li>
          <Link to='/resource1/bus'>Bus</Link>
        </li>
        <li>
          <Link to='/resource1/cart'>Cart</Link>
        </li>
      </ul>

      {
        routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))
      }
    </div>
  )
}

function Bus ({ routes }) {
  return (
    <div>
      <h3>Bus</h3>
      <ul>
        <li>
          <Link to='/resource1/bus/resource3/three_wheel'>Three wheel bus</Link>
        </li>
        <li>
          <Link to='/resource1/bus/resource3/four_wheel'>Four wheel bus</Link>
        </li>
      </ul>

      {
        routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))
      }
    </div>
  )
}

function Cart ({ routes }) {
  return (
    <div>
      <h3>Cart</h3>
      <ul>
        <li>
          <Link to='/resource1/cart/resource3/three_wheel'>Three wheel cart</Link>
        </li>
        <li>
          <Link to='/resource1/cart/resource3/four_wheel'>Four wheel cart</Link>
        </li>
      </ul>

      <Link to='/resource1/bus/resource3/four_wheel'>Back to Four wheel bus</Link>

      {
        routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))
      }

      <Route
        path='/resource1/bus/resource3/four_wheel'
        render={() => (
          <FourWheel />
        )}
      />
    </div>
  )
}

function ThreeWheel () {
  return <h4>Three Wheel</h4>
}

function FourWheel () {
  return <h4>Four Wheel</h4>
}

const routes = [
  {
    path: '/resource2',
    component: Resource2
  },
  {
    path: '/resource1',
    component: Resource1,
    routes: [
      {
        path: '/resource1/bus',
        component: Bus,
        routes: [
          {
            path: '/resource1/bus/resource3/three_wheel',
            component: ThreeWheel
          },
          {
            path: '/resource1/bus/resource3/four_wheel',
            component: FourWheel
          }
        ]
      },
      {
        path: '/resource1/cart',
        component: Cart,
        routes: [
          {
            path: '/resource1/cart/resource3/three_wheel',
            component: ThreeWheel
          },
          {
            path: '/resource1/cart/resource3/four_wheel',
            component: FourWheel
          }
        ]
      }
    ]
  }
]

const routeConfig = [
  {
    resourceType: 'resource1',
    regexp: '/resource1/(\\w+)',
    select: (id, matchResult, query) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('第1个')
          resolve({
            name: id,
            displayName: 'resouce1 display name'
          })
        }, 1000)
      })
    }
  },
  {
    resourceType: 'resource3',
    regexp: /resource1\/(\w+)\/resource3\/(\w+)/i,
    select: (id, matchResult, query) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('第2个')
          resolve({
            name: id,
            displayName: 'resouce3 display name'
          })
        }, 500)
      })
    }
  },
  {
    regexp: /resource1\/cart\/resource3\/(\w+)/i,
    detect: (currLocation, matchResult, query) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('第3个')
        }, 100)
      })
    }
  }
]

function App () {
  const RouteResourceProvider = routeResourceDetector(routeConfig)

  return (
    <Router>
      <RouteResourceProvider>
        <div>
          <ul>
            <li>
              <Link to='/resource1'>Resource1</Link>
            </li>
            <li>
              <Link to='/resource2'>Resource2</Link>
            </li>
          </ul>

          {
            routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))
          }
        </div>
        <RouteResourceConsumer>
          {
            state => {
              console.log('state => ', state)
              return <div>{JSON.stringify(state)}</div>
            }
          }
        </RouteResourceConsumer>
      </RouteResourceProvider>
    </Router>
  )
}

export default App
