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

const RoutesComp = () => {
  RoutesComp.resourceConfigurations = {
    '/class/:classId': {
      handler: () => {
        console.log('class')
      }
    },
    '/class/(\\w)+': {
      handler: () => {
        console.log('regexp class')
      }
    },
    '/class/:classId/student/:studentId': {
      handler: () => {
        console.log('student')
      }
    }
  }

  RoutesComp.routeConfigurations = {
    '/school/class/:classId/student/:studentId': {
      handler: () => {
        console.log('route detect')
      },
      blackList: ['/class/:classId']
    }
  }

  return (
    <React.Fragment>
      <Link to='/school'>School</Link><br/>
      <Link to='/school/class/1'>Class 1</Link><br/>
      <Link to='/school/class/1/student/1'>Class 1 Student 1</Link><br/>

      <Route exact path='/school' component={School} />
      <Route exact path='/school/class/1' component={Classs} />
      <Route exact path='/school/class/1/student/1' component={Student} />
    </React.Fragment>
  )
}

class App extends React.PureComponent {
  render () {
    const Detector = routeResourceDetectorHOC(RoutesComp)

    return (
      <BrowserRouter>
        <Detector />
      </BrowserRouter>
    )
  }
}

export default App
