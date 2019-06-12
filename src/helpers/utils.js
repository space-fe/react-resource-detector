import matchPath from './matchPath'

const noop = () => {}

export const detectResource = (currLocation, pattern, configuration) => {
  const { handler = noop } = configuration
  const { pathname } = currLocation
  const match = matchPath(pathname, { path: pattern, start: false })

  if (match) {
    handler(match.params, match.url, currLocation)
  }
}

export const detectResources = (currLocation, resourceConfigurations, whiteList = [], blackList = []) => {
  let resourcesToBeDetected = Object
    .entries(resourceConfigurations)
    .filter(([pattern]) => !blackList.includes(pattern))

  if (whiteList.length) {
    resourcesToBeDetected = resourcesToBeDetected
      .filter(([pattern]) => whiteList.includes(pattern))
  }

  resourcesToBeDetected.forEach(([pattern, configuration]) => {
    detectResource(currLocation, pattern, configuration)
  })
}

export const triggerHandlers = (currLocation, resourceConfigurations, routeConfigurations) => {
  const { pathname } = currLocation
  let hasMatch = false

  if (routeConfigurations) {
    Object.entries(routeConfigurations).forEach(([pattern, configuration]) => {
      const {
        handler = noop,
        exact = true,
        shouldDetectResource = true,
        whiteList = [],
        blackList = []
      } = configuration

      const match = matchPath(pathname, { path: pattern, exact })

      if (match) {
        hasMatch = true
        handler(match.params, match.url, currLocation)

        if (shouldDetectResource) {
          detectResources(currLocation, resourceConfigurations, whiteList, blackList)
        }
      }
    })
  }

  if (!hasMatch) {
    detectResources(currLocation, resourceConfigurations)
  }
}
