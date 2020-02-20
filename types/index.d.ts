import * as React from 'react'

export interface IConfig {
  shouldDetectResourceForAllRoutes?: boolean,
  detectResourceInSequence?: boolean,
  deselectResources?: boolean
}

declare function routeResourceDetectorHOC<T>(
  DecoratedComponent: React.ComponentType,
  config: IConfig
): React.ComponentType<T>

export default routeResourceDetectorHOC
