import React from 'react'
import routeResourceDetectorHOC from '../src/index'
import cases from 'jest-in-case'

const getLocation = (pathname) => ({ pathname })
const l1 = getLocation('/school')
const l2 = getLocation('/school/class/1')
const l3 = getLocation('/school/class/1/student/1')
const l4 = getLocation('/school/class/1/student/1/blog')
const l5 = getLocation('/school/class/1/student/1/wechat')

cases('test routeResourceDetectorHOC', opts => {
  const {
    isReactComponent,
    routeConfigurations,
    locationChangingPath,
    resourceHandlerTriggerTimes = [],
    routeHandlerTriggerTimes,
    globalConfig = {}
  } = opts

  const [classResourceCallTimes, studentResourceCallTimes] = resourceHandlerTriggerTimes
  const { detectResourceInSequence } = globalConfig

  let classFn = jest.fn()
  let studentFn = jest.fn()

  if (detectResourceInSequence) {
    classFn = jest.fn().mockResolvedValue('class')
    studentFn = jest.fn().mockResolvedValue('student')
  }

  const resourceConfigurations = {
    '/class/:classId': {
      handler: classFn
    },
    '/class/:classId/student/:studentId': {
      handler: studentFn
    }
  }

  function School () {
    School.resourceConfigurations = { ...resourceConfigurations }
    School.routeConfigurations = { ...routeConfigurations }
    return <div>School</div>
  }

  class Component extends React.Component {
    constructor (props) {
      super(props)
      this.resourceConfigurations = { ...resourceConfigurations }
      this.routeConfigurations = { ...routeConfigurations }
    }

    render () {
      return <div>Component</div>
    }
  }

  // DetectorComp is React Element `ResourceDetectorComponent`
  const DetectorComp = routeResourceDetectorHOC(isReactComponent ? Component : School, { detectResourceInSequence })

  // Execute `DetectorComp` component once, in order to assign value to `DetectorComp.handleRouteChanged`
  mount(<DetectorComp />)

  locationChangingPath.reduce((prevLocation, currLocation) => {
    DetectorComp.handleRouteChanged(prevLocation, currLocation)
    return currLocation
  }, null)

  if (!detectResourceInSequence) {
    expect(classFn).toHaveBeenCalledTimes(classResourceCallTimes)
    expect(studentFn).toHaveBeenCalledTimes(studentResourceCallTimes)
  } else {
    expect(classFn).toHaveReturned()
    // expect(studentFn).toHaveReturned()
  }

  routeConfigurations && Object.entries(routeConfigurations).forEach(([pattern, configuration], index) => {
    const { handler } = configuration
    expect(handler).toHaveBeenCalledTimes(routeHandlerTriggerTimes[index])
  })
}, [
  {
    name: 'If routeConfigurations is not provided, and the route has no matched resource',
    locationChangingPath: [l1],
    resourceHandlerTriggerTimes: [0, 0]
  },
  {
    name: 'If routeConfigurations is not provided, and the route has matched resource',
    locationChangingPath: [l2],
    resourceHandlerTriggerTimes: [1, 0]
  },
  {
    name: 'If routeConfigurations is provided, and the route has no matched resource and no matched route pattern',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l1],
    resourceHandlerTriggerTimes: [0, 0],
    routeHandlerTriggerTimes: [0]
  },
  {
    name: 'If routeConfigurations is provided, and the route has no matched resource and matched route pattern',
    routeConfigurations: {
      '/school': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l1],
    resourceHandlerTriggerTimes: [0, 0],
    routeHandlerTriggerTimes: [1]
  },
  {
    name: 'If routeConfigurations is provided, and the route has matched resource and no matched route pattern',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l2],
    resourceHandlerTriggerTimes: [1, 0],
    routeHandlerTriggerTimes: [0]
  },
  {
    name: 'If routeConfigurations is provided, and the route has matched resources and matched route pattern',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l3],
    resourceHandlerTriggerTimes: [1, 1],
    routeHandlerTriggerTimes: [1]
  },
  {
    name: 'If routeConfigurations is provided, and the route has matched resources and one exact matched route pattern',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn()
      },
      '/school/class/:classId/student/:studentId/blog': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l4],
    resourceHandlerTriggerTimes: [1, 1],
    routeHandlerTriggerTimes: [0, 1]
  },
  {
    name: 'If routeConfigurations is provided, and the route has matched resources and partial matched route pattern',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn(),
        exact: false
      },
      '/school/class/:classId/student/:studentId/blog': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l4],
    resourceHandlerTriggerTimes: [2, 2],
    routeHandlerTriggerTimes: [1, 1]
  },
  {
    name: 'If routeConfigurations with whiteList is provided',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn(),
        whiteList: ['/class/:classId']
      }
    },
    locationChangingPath: [l3],
    resourceHandlerTriggerTimes: [1, 0],
    routeHandlerTriggerTimes: [1]
  },
  {
    name: 'If routeConfigurations with blackList is provided',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn(),
        blackList: ['/class/:classId']
      }
    },
    locationChangingPath: [l3],
    resourceHandlerTriggerTimes: [0, 1],
    routeHandlerTriggerTimes: [1]
  },
  {
    name: 'If routeConfigurations with both whiteList and blackList is provided',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn(),
        whiteList: ['/class/:classId'],
        blackList: ['/class/:classId']
      }
    },
    locationChangingPath: [l3],
    resourceHandlerTriggerTimes: [0, 0],
    routeHandlerTriggerTimes: [1]
  },
  {
    name: 'If route configuration.shouldDetectResource=false',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn(),
        shouldDetectResource: false
      }
    },
    locationChangingPath: [l3],
    resourceHandlerTriggerTimes: [0, 0],
    routeHandlerTriggerTimes: [1]
  },
  {
    name: 'If the decorated component is a React Component',
    isReactComponent: true,
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l3],
    resourceHandlerTriggerTimes: [1, 1],
    routeHandlerTriggerTimes: [1]
  },
  {
    name: 'If routeConfigurations is not provided, and location changes once continuously',
    locationChangingPath: [l1, l2],
    resourceHandlerTriggerTimes: [1, 0]
  },
  {
    name: 'If routeConfigurations is not provided, and location changes twice continuously',
    locationChangingPath: [l1, l2, l3],
    resourceHandlerTriggerTimes: [2, 1]
  },
  {
    name: 'If routeConfigurations is not provided, and location changes twice discontinuously',
    locationChangingPath: [l4, l5, l2],
    resourceHandlerTriggerTimes: [3, 2]
  },
  {
    name: 'If routeConfigurations is provided, the route has matched route patter, and location changes twice discontinuously',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId/blog': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l4, l5, l2],
    resourceHandlerTriggerTimes: [3, 2],
    routeHandlerTriggerTimes: [1]
  },
  {
    name: 'If routeConfigurations and globalConfig are provided, and the route has matched resources and matched route pattern',
    routeConfigurations: {
      '/school/class/:classId/student/:studentId': {
        handler: jest.fn()
      }
    },
    locationChangingPath: [l3],
    routeHandlerTriggerTimes: [1],
    globalConfig: {
      detectResourceInSequence: true
    }
  }
])
