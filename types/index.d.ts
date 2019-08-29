import * as React from 'react'

declare function routeResourceDetectorHOC<T>(
  DecoratedComponent: React.ComponentType,
  config: {
    shouldDetectResourceForAllRoutes?: boolean
  }
): React.ComponentType<T>

export default routeResourceDetectorHOC
