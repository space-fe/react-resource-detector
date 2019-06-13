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
    location,
    callTimes
  } = opts

  const [classResourceCallTimes, studentResourceCallTimes, routeCallTimes] = callTimes

  const classFn = jest.fn()

  const studentFn = jest.fn()

  // const resourceFn = jest.fn()
  const routeFn = jest.fn()

  const resourceConfigurations = {
    '/class/:classId': {
      handler: classFn
    },
    '/class/:classId/student/:studentId': {
      handler: studentFn
    }
  }
  const routeConfigurations = {
    '/school/class/:classId/student/:studentId': {
      handler: routeFn,
      blackList: ['/class/:classId']
    },
    '/school/class/:classId/student/:studentId/blog': {
      handler: routeFn,
      whiteList: ['/class/:classId']
    },
    '/school/class/:classId/student/:studentId/wechat': {
      handler: routeFn,
      shouldDetectResource: false
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

  const DetectorComp = routeResourceDetectorHOC(isReactComponent ? Component : School)

  class App extends React.Component {
    pRef = null

    render () {
      return <DetectorComp ref={ref => { this.pRef = ref }} />
    }
  }

  const comp = mount(<App />)
  const instance = comp.instance().pRef

  instance.handleRouteChanged(null, location)

  expect(classFn).toHaveBeenCalledTimes(classResourceCallTimes)
  expect(studentFn).toHaveBeenCalledTimes(studentResourceCallTimes)
  expect(routeFn).toHaveBeenCalledTimes(routeCallTimes)
}, [
  // {
  //   name: '',
  //   isReactComponent: false,
  //   resourceConfigurations: {
  //     '/class/:classId': {
  //       handler: jest.fn()
  //     }
  //   },
  //   routeConfigurations: {}, // whiteList & blackList
  //   locationChangingPath: [l1],
  //   resourceHandlerTriggerTimes: [],
  //   routeHandlerTriggerTimes: []
  // },
  {
    name: 'Should not call any functions when there are no matched routes and resources',
    location: l1,
    callTimes: [0, 0, 0]
  },
  {
    name: 'Should call classFn once when there are no matched routes and one matched resource',
    location: l2,
    callTimes: [1, 0, 0]
  },
  {
    name: 'If only blackList is provided, the route will be checked against the resource patterns of resourceConfigurations except the blacklisted ones.',
    location: l3,
    callTimes: [0, 1, 1]
  },
  {
    name: 'If only whiteList is provided, the route will only be checked against the whitelisted resource patterns.',
    location: l4,
    callTimes: [1, 0, 1]
  },
  {
    name: 'Check when the decorated component is React Component.',
    isReactComponent: true,
    location: l3,
    callTimes: [0, 1, 1]
  },
  {
    name: 'The resources lies in the route will not be detected if route configuration.shouldDetectResource=false',
    location: l5,
    callTimes: [0, 0, 1]
  }
])
