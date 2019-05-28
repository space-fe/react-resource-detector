import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { routeResourceDetector } from '../src/index'
import cases from 'jest-in-case'

const getLocation = (pathname, search, hash) => ({ pathname, search, hash })
const l1 = getLocation('/resource1/bus')
const l2 = getLocation('/resource1/bus/resource2/four_wheel')
const l3 = getLocation('/resource3/bus/resource4/four_wheel')

cases('test', opts => {
  const {
    routesConfig,
    configCallTimes,
    errors,
    callHandleRouteChanged,
    callHandleRouteChangedParams = []
  } = opts

  const RouteResourceProvider = routeResourceDetector(routesConfig)
  const RouteResourceConsumer = routeResourceDetector.RouteResourceConsumer

  class Component extends React.Component {
    pRef = null

    render () {
      return (
        <Router>
          <RouteResourceProvider
            ref={ref => this.pRef = ref}
            location={l1}
          >
            <div>test</div>
          </RouteResourceProvider>
        </Router>
      )
    }
  }

  const comp = mount(<Component />)
  const providerInstance = comp.instance().pRef.instanceRef

  if (callHandleRouteChanged) {
    const [prevLocation, currLocation] = callHandleRouteChangedParams
    providerInstance.handleRouteChanged(prevLocation, currLocation)
  }

  configCallTimes && configCallTimes.forEach(([ fn, times ], index) => {
    expect(routesConfig[index][fn]).toHaveBeenCalledTimes(times)
  })

  errors && errors.forEach(([ fn, errorType, currentLocation ], index) => {
    const mockFn = ({ regexp, detect }, currLocation) => {
      return new Promise((resolve, reject) => {
        if (!detect || typeof detect !== 'function') {
          reject(new Error('detect function must be provided!'))
        }

        resolve()
      })
    }

    expect(() => {
      return mockFn(routesConfig[index], currentLocation)
    }).toThrow()
  })

}, [
  {
    routesConfig: [
      {
        resourceType: 'resource1',
        regexp: /resource1\/(\w+)/i,
        select: jest.fn(() => {
          console.log('resource1')
        })
      }
    ],
    callHandleRouteChanged: false,
    configCallTimes: [
      ['select', 1]
    ]
  },
  // {
  //   routesConfig: [
  //     {
  //       regexp: /resource1\/(\w+)/i
  //     }
  //   ],
  //   // callHandleRouteChanged: true,
  //   // callHandleRouteChangedParams: [null, l1],
  //   errors: [
  //     ['detect', Error, l1]
  //   ]
  // },
  {
    routesConfig: [
      {
        resourceType: 'resource1',
        regexp: /resource1\/(\w+)/i,
        select: jest.fn(() => {
          console.log('resource1')
        })
      },
      {
        resourceType: 'resource2',
        regexp: /resource1\/(\w+)\/resource2\/(\w+)/i,
        select: jest.fn(() => {
          console.log('resource2')
        })
      }
    ],
    callHandleRouteChanged: true,
    callHandleRouteChangedParams: [l1, l2],
    configCallTimes: [
      ['select', 2],
      ['select', 1]
    ]
  },
  {
    routesConfig: [
      {
        resourceType: 'resource3',
        regexp: '\/resource3\/(\\w+)',
        select: jest.fn(() => {
          console.log('resource3')
        })
      },
      {
        regexp: '\/resource3\/(\\w+)\/resource4\/(\\w+)',
        detect: jest.fn(() => {
          console.log('resource4')
        })
      }
    ],
    callHandleRouteChanged: true,
    callHandleRouteChangedParams: [null, l3],
    configCallTimes: [
      ['select', 1],
      ['detect', 1]
    ]
  }
])
