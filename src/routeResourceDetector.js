import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import onRouteChanged from './onRouteChanged'

const { Provider, Consumer } = React.createContext()

const routeResourceDetector = (routeConfig) => {
  class RouteResourceProvider extends React.PureComponent {
    static propTypes = {
      children: PropTypes.any
    }

    state = {}

    processRouteItem = async ({ type, regexp, select, detect }, currLocation) => {
      const { pathname, search } = currLocation
      const query = queryString.parse(search, { arrayFormat: 'comma' })

      const matchResult = pathname.match(regexp)
      const id = matchResult && matchResult[0]

      if (!id) return

      const processFn = select || detect
      const param = select ? id : pathname

      try {
        const resource = await processFn(param, matchResult, query)

        this.setState({
          [type]: resource
        })
      } catch (err) {
        processFn(param, matchResult, query)
      }
    }

    handleRouteChanged = (prevLocation, currLocation) => {
      routeConfig.forEach(configItem => {
        this.processRouteItem(configItem, currLocation)
      })
    }

    render () {
      return (
        <Provider value={this.state}>
          {this.props.children}
        </Provider>
      )
    }
  }

  return onRouteChanged(RouteResourceProvider, true, false)
}

routeResourceDetector.RouteResourceConsumer = Consumer

export default routeResourceDetector
