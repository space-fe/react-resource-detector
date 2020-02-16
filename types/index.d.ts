import * as React from 'react'

declare function routeResourceDetectorHOC<T>(
  DecoratedComponent: React.ComponentType,
  config: {
    shouldDetectResourceForAllRoutes?: boolean,
    detectResourceInSequence?: boolean
  }
): React.ComponentType<T>

export default routeResourceDetectorHOC
