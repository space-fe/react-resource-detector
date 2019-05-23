import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import onRouteChangedHOC from 'react-onroutechanged'

const { Provider, Consumer } = React.createContext()

const routeResourceDetector = (routesConfig) => {
  let prevCachedMap = new Map()
  const currCachedMap = new Map()

  class RouteResourceProvider extends React.PureComponent {
    static propTypes = {
      children: PropTypes.node.isRequired
    }

    __checkIfCachedExist = id => {
      const prevCachedData = prevCachedMap.get(id)

      if (prevCachedData) {
        currCachedMap.set(id, prevCachedData)
        return true
      }

      return false
    }

    __processRouteItem = ({ type, regexp, select, detect }, currLocation) => {
      return new Promise(async (resolve, reject) => {
        const { pathname, search } = currLocation
        const query = queryString.parse(search, { arrayFormat: 'comma' })

        const matchResult = pathname.match(regexp)
        const id = matchResult && matchResult[0]

        if (!id) {
          this.setState({ [type]: undefined })
          resolve()
          return
        }

        if (this.__checkIfCachedExist(id)) {
          resolve()
          return
        }

        const processFn = select || detect
        const param = select ? id : currLocation

        const resource = await processFn(param, matchResult, query)
        currCachedMap.set(id, resource)
        this.setState({ [type]: resource })

        resolve()
      })
    }

    handleRouteChanged = async (_, currLocation) => {
      currCachedMap.clear()

      const promises = routesConfig.map(item => {
        return this.__processRouteItem(item, currLocation)
      })
      await Promise.all(promises)

      prevCachedMap = new Map(currCachedMap)
    }

    render () {
      return (
        <Provider value={this.state}>
          {this.props.children}
        </Provider>
      )
    }
  }

  return onRouteChangedHOC(RouteResourceProvider, { mounted: true, onlyPathname: false })
}

routeResourceDetector.RouteResourceConsumer = Consumer

export default routeResourceDetector
