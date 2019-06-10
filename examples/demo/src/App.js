import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import routeResourceDetectorHOC from './temp'
// import routeResourceDetectorHOC from 'react-resource-detector'

function School () {
  return <h2>School</h2>
}

function Classs () {
  return <h2>Class</h2>
}

function Student () {
  return <h2>Student</h2>
}

function RoutesComp () {
  RoutesComp.resourceConfigurations = {}

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
      <Router>
        <Detector />
      </Router>
    )
  }
}

export default App
