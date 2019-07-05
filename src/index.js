import * as React from 'react'
import onRouteChangedHOC from 'react-onroutechanged'
import matchPath from './helpers/matchPath'

const noop = () => {}

const routeResourceDetectorHOC = (DecoratedComponent) => {
  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
  const isReactComponent = DecoratedComponent.prototype && DecoratedComponent.prototype.isReactComponent

  let resourceConfigurations
  let routeConfigurations

  class ResourceDetectorComponent extends React.PureComponent {
    static displayName = `RouteResourceDetector(${componentName})`

    __getResourcesToBeDetected = (whiteList = [], blackList = []) => {
      let resourcesToBeDetected = Object
        .entries(resourceConfigurations)
        .filter(([pattern]) => !blackList.includes(pattern))

      if (whiteList.length) {
        resourcesToBeDetected = resourcesToBeDetected
          .filter(([pattern]) => whiteList.includes(pattern))
      }

      return resourcesToBeDetected
    }

    __detectResources = (currLocation, resources) => {
      resources.forEach(([pattern, configuration]) => {
        const { handler = noop } = configuration
        const { pathname } = currLocation
        const match = matchPath(pathname, { path: pattern, start: false })

        if (match) {
          handler(match.params, match.url, currLocation)
        }
      })
    }

    __triggerRouteHandlers = (currLocation) => {
      const { pathname } = currLocation
      let hasMatch = false

      if (routeConfigurations) {
        Object.entries(routeConfigurations)
          .forEach(([pattern, configuration]) => {
            const { handler = noop, exact = true, whiteList = [], blackList = [], shouldDetectResource = true } = configuration
            const match = matchPath(pathname, { path: pattern, exact })

            if (match) {
              hasMatch = true
              handler(match.params, match.url, currLocation)

              if (shouldDetectResource) {
                const resourcesToBeDetected = this.__getResourcesToBeDetected(whiteList, blackList)
                this.__detectResources(currLocation, resourcesToBeDetected)
              }
            }
          })
      }

      if (!hasMatch) {
        const resourcesToBeDetected = this.__getResourcesToBeDetected()
        this.__detectResources(currLocation, resourcesToBeDetected)
      }
    }

    handleRouteChanged = (_, currLocation) => {
      this.__triggerRouteHandlers(currLocation)
    }

    componentDidMount () {
      if (isReactComponent) {
        resourceConfigurations = this.instanceRef.resourceConfigurations
        routeConfigurations = this.instanceRef.routeConfigurations
      } else {
        resourceConfigurations = DecoratedComponent.resourceConfigurations
        routeConfigurations = DecoratedComponent.routeConfigurations
      }

      if (!resourceConfigurations || !Object.keys(resourceConfigurations).length) {
        throw new Error(`The resourceConfigurations of ${componentName} must be provided!`)
      }
    }

    render () {
      const { ...props } = this.props

      if (isReactComponent) {
        props.ref = ref => { this.instanceRef = ref }
      }

      return (
        <DecoratedComponent {...props} />
      )
    }
  }

  return onRouteChangedHOC(ResourceDetectorComponent, { mounted: true })
}

export default routeResourceDetectorHOC
