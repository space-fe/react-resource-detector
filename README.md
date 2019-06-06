# react-resource-detector
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
  this.resourceConfiguration = {
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

  this.routeConfiguration = {
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

export default routeResourceDetectorHOC(StudentManagement)
```

### Functional Component
```javascript
import React from 'react'
import routeResourceDetectorHOC from 'react-resource-detector'

const StudentInfo = (props) => {
  Demo.resourceConfiguration = {} // The same as ES6 Class Component
  Demo.routeConfiguration = {}    // The same as ES6 Class Component
}

export default routeResourceDetectorHOC(StudentInfo)
```

## Resource Configuration
- The `resourceConfiguration` property is a map indicating the resources detection method. The key is a resource pattern, and the value is the resource detection configuration.
- If `resourceConfiguration` property is not provided, then the routeResourceDetector will not detect the resources in the route.

### Resource Pattern
The resource pattern can be either a `string` or a `regexp` object.

### Resource Detection Configuration
| Name           | Type      | Default | Description                                                                                                                                                                                                                             |
| -------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handler` | `function` |  | (matches, path, location) => {}, `matches` is the map of param name and value lies in the pattern, `path` is the exact match result of the pattern, `location` is the current location object. |

## Route Configuration
- The `routeConfiguration` property is a map indicating what to do with the configured routes when the route changes. The key is a route pattern, and the value is the route processing configuration.
- If `routeConfiguration` property is not provided, then all of the routes will detect the resources when route changes if `resourceConfiguration` property exists.

### Route Pattern
The route pattern can be either a `string` or a `regexp` object.

### Route Processing Configuration
| Name           | Type      | Default | Description                                                                                                                                                                                                                             |
| -------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `handler` | `function` |  | The same as the resource configuration above. |
| `exact` | `boolean` | `true` | If `true`, the handler function will be executed when the route completely matches the route pattern. |
| `shouldDetectResource` | `boolean` | `true` | If `true`, the resources lies in the route will be detected. |
| `whiteList` | `array` |  | Resources in the whiteList will be detected. |
| `blackList` | `array` |  | Resources in the blackList will not be detected. |

#### WhiteList and BlackList
- If only `whiteList` is provided, only the resources in the whiteList that matches the route will be detected.
- If only `blackList` is provided, the resources in the `resourceConfiguration` property and not in the blackList that matches the route will be detected.
- If both `whiteList` and `blackList` are provided, then the resources in the whiteList and not in the blackList that matches the route will be detected.
