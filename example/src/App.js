import React from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import routeResourceDetectorHOC from '../../src'

function School () {
  return <h2>School</h2>
}

function Classs () {
  return <h2>Class</h2>
}

function Student () {
  return <h2>Student</h2>
}

function Teacher () {
  return <h2>Teacher</h2>
}

const RoutesComp = () => {
  RoutesComp.resourceConfigurations = {
    'class/:classId/teacher/:teacherId': {
      handler: async () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('path teacher resource')
            reject(new Error('teacher resource error'))
          }, 2000)
        })
      }
    },
    'class/:classId': {
      handler: async () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log('path class resource')
            resolve()
          }, 1000)
        })
      }
    },
    'class/(\\w)+': {
      handler: () => {
        console.log('regexp class resource')
      }
    },
    'class/:classId/student/:studentId': {
      handler: () => {
        console.log('path student resource')
      }
    }
  }

  RoutesComp.routeConfigurations = {
    '/school/class/:classId/student/:studentId': {
      handler: () => {
        console.log('student route')
      },
      blackList: ['class/:classId']
    },
    '/school/class/:classId/teacher/:teacherId': {
      handler: () => {
        console.log('teacher route')
      }
    }
  }

  // Teacher: 开启 detectResourceInSequence 后，某个resource报错后，不会继续往下执行

  return (
    <React.Fragment>
      <Link to='/school'>School</Link><br/>
      <Link to='/school/class/1'>Class 1</Link><br/>
      <Link to='/school/class/1/student/1'>Class 1 Student 1</Link><br/>
      <Link to='/school/class/1/teacher/1'>Class 1 Teacher 1</Link><br/>

      <Route exact path='/school' component={School} />
      <Route exact path='/school/class/1' component={Classs} />
      <Route exact path='/school/class/1/student/1' component={Student} />
      <Route exact path='/school/class/1/teacher/1' component={Teacher} />
    </React.Fragment>
  )
}

class App extends React.PureComponent {
  render () {
    const Detector = routeResourceDetectorHOC(RoutesComp, { detectResourceInSequence: true })

    return (
      <BrowserRouter>
        <Detector />
      </BrowserRouter>
    )
  }
}

export default App
