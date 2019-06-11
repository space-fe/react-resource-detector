import * as React from 'react'
import onRouteChangedHOC from 'react-onroutechanged'
import { triggerHandlers } from './helpers/utils'

const routeResourceDetectorHOC = (DecoratedComponent) => {
  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component'
  const isReactComponent = DecoratedComponent.prototype.isReactComponent

  class ResourceDetectorComponent extends React.PureComponent {
    static displayName = `RouteResourceDetector(${componentName})`

    __getConfigurations = () => {
      let resourceConfigurations
      let routeConfigurations

      if (isReactComponent) {
        resourceConfigurations = this.instanceRef.resourceConfigurations
        routeConfigurations = this.instanceRef.routeConfigurations
      } else {
        resourceConfigurations = DecoratedComponent.resourceConfigurations
        routeConfigurations = DecoratedComponent.routeConfigurations
      }

      return {
        resourceConfigurations,
        routeConfigurations
      }
    }

    handleRouteChanged = (prevLocation, currLocation) => {
      const configs = this.__getConfigurations()

      const {
        resourceConfigurations,
        routeConfigurations
      } = configs

      triggerHandlers(currLocation, resourceConfigurations, routeConfigurations)
    }

    componentDidMount () {
      const { resourceConfigurations } = this.__getConfigurations()

      if (!resourceConfigurations || !Object.keys(resourceConfigurations).length) {
        throw new Error(`The resourceConfigurations of ${DecoratedComponent} must be provided!`)
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
