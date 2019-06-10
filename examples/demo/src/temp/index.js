import * as React from 'react'
import onRouteChangedHOC from 'react-onroutechanged'

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
      const {
        resourceConfigurations,
        routeConfigurations
      } = this.__getConfigurations()

      console.log('handleRouteChanged')
      console.log('prevLocation => ', prevLocation)
      console.log('currLocation => ', currLocation)
    }

    componentDidMount () {
      const { resourceConfigurations } = this.__getConfigurations()
      if (!resourceConfigurations || typeof resourceConfigurations !== 'object') {
        throw new Error(`The resourceConfigurations of ${DecoratedComponent} must be provided!`)
      }
    }

    render () {
      const { ...props } = this.props

      if (isReactComponent) {
        props.ref = ref => { this.instanceRef = ref }
      }

      return (
        <DecoratedComponent {...this.props} />
      )
    }
  }

  return onRouteChangedHOC(ResourceDetectorComponent, { mounted: true })
}

export default routeResourceDetectorHOC
