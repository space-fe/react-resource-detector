import * as React from 'react'
import onRouteChangedHOC from 'react-onroutechanged'
import matchPath from './helpers/matchPath'
import { configDefaulter } from './helpers/config'

const noop = () => {}
const { useEffect, useRef } = React

const routeResourceDetectorHOC = (
  DecoratedComponent,
  config = {
    shouldDetectResourceForAllRoutes: true,
    detectResourceInSequence: false,
    deselectResources: false
  }
) => {
  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
  const isReactComponent = DecoratedComponent.prototype && DecoratedComponent.prototype.isReactComponent

  const shouldDetectResourceForAllRoutes = configDefaulter(config.shouldDetectResourceForAllRoutes, true)
  const detectResourceInSequence = configDefaulter(config.detectResourceInSequence, false)
  const deselectResources = configDefaulter(config.deselectResources, false)

  let resourceConfigurations
  let routeConfigurations

  const ResourceDetectorComponent = (props) => {
    const instanceRef = useRef()

    const __getResourcesToBeDetected = (whiteList = [], blackList = []) => {
      let resourcesToBeDetected = Object
        .entries(resourceConfigurations)
        .filter(([pattern]) => !blackList.includes(pattern))

      if (whiteList.length) {
        resourcesToBeDetected = resourcesToBeDetected
          .filter(([pattern]) => whiteList.includes(pattern))
      }

      return resourcesToBeDetected
    }

    const __detectResources = async (currLocation, resources) => {
      for (const [pattern, configuration] of resources) {
        const { handler = noop } = configuration
        const { pathname } = currLocation
        const match = matchPath(pathname, { path: pattern, start: false })

        if (!match) {
          continue
        }

        if (detectResourceInSequence) {
          await handler(match.params, match.url, currLocation)
        } else {
          handler(match.params, match.url, currLocation)
        }
      }
    }

    const __triggerRouteHandlers = (currLocation) => {
      const { pathname } = currLocation
      let hasMatch = false

      if (routeConfigurations) {
        const routeConfigs = Object.entries(routeConfigurations)
        for (const [pattern, configuration] of routeConfigs) {
          const {
            handler = noop,
            exact = true,
            whiteList = [],
            blackList = [],
            shouldDetectResource = true
          } = configuration
          const match = matchPath(pathname, { path: pattern, exact })

          if (!match) {
            continue
          }

          hasMatch = true
          handler(match.params, match.url, currLocation)

          if (!shouldDetectResource) {
            continue
          }

          const resourcesToBeDetected = __getResourcesToBeDetected(whiteList, blackList)
          __detectResources(currLocation, resourcesToBeDetected)
        }
      }

      if (!hasMatch && shouldDetectResourceForAllRoutes) {
        const resourcesToBeDetected = __getResourcesToBeDetected()
        __detectResources(currLocation, resourcesToBeDetected)
      }
    }

    const __beforeRouteChangedHandler = async (prevLocation) => {
      const { pathname } = prevLocation

      if (routeConfigurations) {
        const routeConfigs = Object.entries(routeConfigurations)
        for (const [pattern, configuration] of routeConfigs) {
          const {
            deselect = noop,
            exact = true
          } = configuration
          const match = matchPath(pathname, { path: pattern, exact })

          if (!match) {
            continue
          }

          await deselect(match.params, match.url, prevLocation)
        }
      }
    }

    ResourceDetectorComponent.handleRouteChanged = async (prevLocation, currLocation) => {
      if (prevLocation && deselectResources) {
        await __beforeRouteChangedHandler(prevLocation)
      }

      __triggerRouteHandlers(currLocation)
    }

    useEffect(() => {
      if (isReactComponent) {
        resourceConfigurations = instanceRef.current.resourceConfigurations
        routeConfigurations = instanceRef.current.routeConfigurations
      } else {
        resourceConfigurations = DecoratedComponent.resourceConfigurations
        routeConfigurations = DecoratedComponent.routeConfigurations
      }

      if (!resourceConfigurations || !Object.keys(resourceConfigurations).length) {
        throw new Error(`The resourceConfigurations of ${componentName} must be provided!`)
      }
    }, [])

    const { ...allProps } = props

    if (isReactComponent) {
      allProps.ref = ref => { instanceRef.current = ref }
    }

    return <DecoratedComponent {...allProps} />
  }

  return onRouteChangedHOC(ResourceDetectorComponent, { mounted: true })
}

export default routeResourceDetectorHOC
