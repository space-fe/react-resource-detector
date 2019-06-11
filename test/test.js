import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import routeResourceDetectorHOC from '../src/index'
import cases from 'jest-in-case'

const getLocation = (pathname) => ({ pathname })
const l1 = getLocation('/school')
const l2 = getLocation('/school/class/1')
const l3 = getLocation('/school/class/1/student/1')

cases('test', opts => {
  const {
    location,
    callTimes
  } = opts

  const [classResourceCallTimes, studentResourceCallTimes, routeCallTimes] = callTimes

  const classFn = jest.fn(() => {
    console.log('class')
  })

  const studentFn = jest.fn(() => {
    console.log('student')
  })

  const routeFn = jest.fn(() => {
    console.log('route detect')
  })

  class School extends React.PureComponent {
    resourceConfigurations = {
      '/class/:classId': {
        handler: classFn
      },
      '/class/:classId/student/:studentId': {
        handler: studentFn
      }
    }
    routeConfigurations = {
      '/school/class/:classId/student/:studentId': {
        handler: routeFn,
        blackList: ['/class/:classId']
      }
    }

    render () {
      return <div>School</div>
    }
  }

  const DetectorComp = routeResourceDetectorHOC(School)

  class App extends React.Component {
    pRef = null

    render () {
      return (
        <Router>
          <DetectorComp
            ref={ref => { this.pRef = ref }}
            location={l1}
          />
        </Router>
      )
    }
  }

  const comp = mount(<App />)
  const instance = comp.instance().pRef.instanceRef

  instance.handleRouteChanged(null, location)

  expect(classFn.toHaveBeenCalledTimes(classResourceCallTimes))
  expect(studentFn.toHaveBeenCalledTimes(studentResourceCallTimes))
  expect(routeFn.toHaveBeenCalledTimes(routeCallTimes))
}, [
  {
    location: l1,
    callTimes: [0, 0, 0]
  },
  {
    location: l2,
    callTimes: [0, 1, 0]
  },
  {
    location: l3,
    callTimes: [0, 1, 1]
  }
])
