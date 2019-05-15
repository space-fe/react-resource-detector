import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

const onRouteChanged = (DecoratedComponent, mounted, onlyPathname = true) => {
  class RouteChangedComponent extends React.Component {
    static propTypes = {
      location: PropTypes.object,
      history: PropTypes.object
    }

    componentDidMount () {
      if (typeof this.instanceDOM.handleRouteChanged !== 'function') {
        throw new Error(
          'WrappedComponent lacks a handleRouteChanged(prevLocation, currLoaction) for processing route changed event.'
        )
      }

      if (mounted) {
        this.instanceDOM.handleRouteChanged(null, this.props.location)
      }
    }

    componentWillReceiveProps (nextProps) {
      if (this.props.location === nextProps.location) {
        return
      }

      const isSamePath = this.props.location.pathname === nextProps.location.pathname
      const isSameSearch = this.props.location.search === nextProps.location.search
      const isSameHash = this.props.location.hash === nextProps.location.hash

      let isRouteChanged = false

      if (isSamePath) {
        if (!onlyPathname && (!isSameHash || !isSameSearch)) {
          isRouteChanged = true
        }
      } else {
        isRouteChanged = true
      }

      if (isRouteChanged) {
        this.instanceDOM.handleRouteChanged(this.props.location, nextProps.location)
      }
    }

    render () {
      return <DecoratedComponent
        ref={dom => { this.instanceDOM = dom }}
        {...this.props}
      />
    }
  }

  return withRouter(RouteChangedComponent)
}

export default onRouteChanged
