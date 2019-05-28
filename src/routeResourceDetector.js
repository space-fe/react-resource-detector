import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import onRouteChangedHOC from 'react-onroutechanged'

const { Provider, Consumer } = React.createContext()

const routeResourceDetector = (routesConfig, routeChangeConfig = { mounted: true, onlyPathname: false }) => {
  let prevCacheMap = new Map()
  const currCacheMap = new Map()

  class RouteResourceProvider extends React.PureComponent {
    static propTypes = {
      children: PropTypes.node.isRequired
    }

    __checkIfCacheExist = id => {
      const prevCachedData = prevCacheMap.get(id)

      if (prevCachedData) {
        currCacheMap.set(id, prevCachedData)
        return true
      }

      return false
    }

    __processParams = (regexp, currLocation) => {
      const { pathname, search } = currLocation
      const query = queryString.parse(search, { arrayFormat: 'comma' })

      if (typeof regexp === 'string') {
        regexp = new RegExp(regexp)
      }

      const matchResult = pathname.match(regexp)

      return {
        query,
        matchResult
      }
    }

    __selectResource = ({ resourceType, regexp, select }, currLocation) => {
      return new Promise(async (resolve, reject) => {
        const { query, matchResult } = this.__processParams(regexp, currLocation)
        const id = matchResult && matchResult[0]

        if (!id) this.setState({ [resourceType]: undefined })

        if (!id || this.__checkIfCacheExist(id)) {
          resolve()
          return
        }

        const resource = await select(id, matchResult, query)
        currCacheMap.set(id, resource)
        this.setState({ [resourceType]: resource })

        resolve(resource)
      })
    }

    __detectResource = ({ regexp, detect }, currLocation) => {
      return new Promise(async (resolve, reject) => {
        if (!detect || typeof detect !== 'function') {
          reject(new Error('detect function must be provided!'))
        }

        const { query, matchResult } = this.__processParams(regexp, currLocation)

        if (matchResult && matchResult[0]) {
          await detect(currLocation, matchResult, query)
        }

        resolve()
      })
    }

    handleRouteChanged = async (_, currLocation) => {
      currCacheMap.clear()

      const promises = routesConfig.map(item => {
        const { resourceType } = item
        return resourceType ? this.__selectResource(item, currLocation) : this.__detectResource(item, currLocation)
      })
      await Promise.all(promises)

      prevCacheMap = new Map(currCacheMap)
    }

    render () {
      return (
        <Provider value={this.state}>
          {this.props.children}
        </Provider>
      )
    }
  }

  return onRouteChangedHOC(RouteResourceProvider, routeChangeConfig)
}

routeResourceDetector.RouteResourceConsumer = Consumer

export default routeResourceDetector
