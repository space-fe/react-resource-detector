# react-resource-detector
[![Build Status](https://travis-ci.org/space-fe/react-resource-detector.svg?branch=master)](https://travis-ci.org/space-fe/react-resource-detector)

A resource detector for React, based on [**react-onroutechanged**](https://github.com/space-fe/react-onroutechanged).

The `react-resource-detector` is a React Higer Order Component(HOC) that you can use with your own React components if you want to detect the resources in route when route changes.

## Installation
Use `npm`
```shell
npm install react-resource-detector
```
Use `yarn`
```shell
yarn add react-resource-detector
```

## Usage

### ES6 Class Component
```javascript
import React from 'react'
import routeResourceDetectorHOC from 'react-resource-detector'

class StudentInfo extends React.PureComponent {
  this.resourceConfigurations = {
    '/class/:classId': {
      handler: (matches, path, location) => {
        // ...detect resource
        /*
         * matches: { classId: value }
         * path: /class/class-id
         * location: Current location object
         */
      }
    },
    '/student/:studentId': {
      handler: (matches, path, location) => {}
    }
  }

  this.routeConfigurations = {
    '/class/:classId/student/:studentId': {
      handler: (matches, path, location) => {},
      exact: true,
      shouldDetectResource: true,
      whiteList: ['/student/:studentId'],
      blackList: ['/class/:classId']
    },
  }

  render () {
    return (
      <div>student</div>
    )
  }
}

export default routeResourceDetectorHOC(StudentInfo)
```

### Functional Component
```javascript
import React from 'react'
import routeResourceDetectorHOC from 'react-resource-detector'

const StudentInfo = (props) => {
  StudentInfo.resourceConfigurations = {} // The same as ES6 Class Component
  StudentInfo.routeConfigurations = {}    // The same as ES6 Class Component
}

export default routeResourceDetectorHOC(StudentInfo)
```

## Resource Configuration
- The `resourceConfigurations` is a dictionary of resource detection configurations. The key is a resource pattern, and the value is a resource detection configuration for this resource.
- `resourceConfigurations` must be provided, otherwise an error will be reported.

### Resource Pattern
A resource pattern can be either a `string` or a `regexp` object.

### Resource Detection Configuration
| Name           | Type      | Default | Description                                                                                                                                                                                                                             |
| -------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handler` | `function` |  | (matches, path, location) => {}, this function will be triggered when there is a match between the resource pattern and the route. `matches` is the map of param name and value lies in the pattern, `path` is the exact match result of the pattern, `location` is the current location object. |

## Route Configuration
- The `routeConfigurations` is a dictionary of route processing configurations. The key is a route pattern, and the value is a route processing configuration for this route.
- `routeConfigurations` is optional, if not provided, all of the routes will be checked against the resource configurations to find out if there are some matches.

### Route Pattern
A route pattern can be either a `string` or a `regexp` object.

### Route Processing Configuration
| Name           | Type      | Default | Description                                                                                                                                                                                                                             |
| -------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handler` | `function` |  | Same as the resource configuration above. |
| `exact` | `boolean` | `true` | If `true`, the handler function will be triggered when the route completely matches the route pattern. |
| `shouldDetectResource` | `boolean` | `true` | If `true`, the resources lies in the route will be detected. |
| `whiteList` | `array` |  | Array of resource patterns. Resources in the whiteList will be detected. |
| `blackList` | `array` |  | Array of resource patterns. Resources in the blackList will not be detected. |

#### WhiteList and BlackList
- If only `whiteList` is provided, the route will only be checked against the whitelisted resource patterns.
- If only `blackList` is provided, the route will be checked against the resource patterns of `resourceConfigurations` except the blacklisted ones.
- If both `whiteList` and `blackList` are provided, the route will be checked against the whitelisted resource patterns that are not in blackList.
