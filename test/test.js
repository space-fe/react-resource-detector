import { routeResourceDetector } from '../src/index'
import React from 'react'
import { mount } from 'enzyme'

const routesConfig = [
  {
    type: 'resource1',
    regexp: /resource1\/(\w)+/i,
    select: () => {}
  },
  {
    type: 'resource2',
    regexp: /resource1\/(\w)+\/resource2\/(\w)+/i,
    select: () => {}
  }
]

const locationMap = {
  l1: 'http://localhost:3000',
  l2: 'http://localhost:3000/resource1/bus',
  l3: 'http://localhost:3000/resource1/cart',
  l4: 'http://localhost:3000/resource1/bus/resource2/three_wheel',
  l5: 'http://localhost:3000/resource1/bus/resource2/four_wheel',
  l6: 'http://localhost:3000/resource1/cart/resource2/three_wheel'
}

const { l1, l2, l3, l4, l5, l6 } = locationMap

const locations = [
  {
    prevLocation: l1,
    currLocation: l2
  },
  {
    prevLocation: l2,
    currLocation: l3
  },
  {
    prevLocation: l2,
    currLocation: l4
  },
  {
    prevLocation: l3,
    currLocation: l4
  },
  {
    prevLocation: l4,
    currLocation: l5
  },
  {
    prevLocation: l5,
    currLocation: l6
  },
]

const RouteResourceProvider = routeResourceDetector(routesConfig)
const RouteResourceConsumer = routeResourceDetector.RouteResourceConsumer

const handleRouteChangedFunc = jest.fn()
const __processRouteItemFunc = jest.fn()
const __checkIfCachedExistFunc = jest.fn()

RouteResourceProvider.prototype.handleRouteChanged = handleRouteChangedFunc
RouteResourceProvider.prototype.__processRouteItem = __processRouteItemFunc
RouteResourceProvider.prototype.__checkIfCachedExist = __checkIfCachedExistFunc

class Component extends React.Component {
  render () {
    return (
      <RouteResourceProvider>
        <div>test</div>
      </RouteResourceProvider>
    )
  }
}

test('test 1', () => {
  const comp = mount(<Component />)

  comp.handleRouteChanged(l1, l2)

  expect(__processRouteItemFunc)
    .toHaveBeenCalledTimes(1)
})

// class Component extends React.Component {
//   render () {
//     return (
//       <RouteResourceProvider>
//         <div>test</div>
//       </RouteResourceProvider>
//     )
//   }
// }

function sum(a, b) {
  return a + b
}

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
