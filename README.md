# react-resource-detector
A resource detector for React, based on [**react-onroutechanged**](https://github.com/space-fe/react-onroutechanged).

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

class Demo extends React.PureComponent {
  this.resourceHandlers = {
    '/A/:aid': {
      handler: (matches, path, location) => {
        // ...select resource
      }
    },
    '/B/:bid': {
      handler: (matches, path, location) => {}
    }
  }

  this.routeHandlers = {
    '/A/:aid/B/:bid/xxx': {
      handler: (matches, path, location) => {},
      exact: true,
      selectResource: true,
      whiteList: ['/A/:aid'],
      blackList: ['/B/:bid']
    },
  }

  render () {
    return (
      <div>test</div>
    )
  }
}

export default routeResourceDetectorHOC(Demo)
```

### Functional Component
```javascript
import React from 'react'
import routeResourceDetectorHOC from 'react-resource-detector'

const Demo = () => {
  Demo.resourceHandlers = {}
  Demo.routeHandlers = {}
}

export default routeResourceDetectorHOC(Demo)
```

## Handler parameters of both resourceHandlers and routeHandlers
- matches: Params map of the handlers config key.
- path: The exact match of the handlers config key.
- location: Current location object

For example:
```javascript
this.resourceHandlers = {
  '/A/:aid': {
    handler: (matches, path, location) => {
      // matches: { aid: value }
      // path: /A/aid-value
      // location: Current location object
    }
  }
}
```

## RouteHandlers map values configuration
| Name           | Type      | Default | Description                                                                                                                                                                                                                             |
| -------------- | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `exact` | `boolean` | `true` | If `true`, the handler function will be executed when the route completely matches the configuration item key. |
| `selectResource` | `boolean` | `true` | If `true`, it will select the resources if the route matches the resource configuration. |
| `whiteList` | `array` |  | Resources in the whiteList will be selected. |
| `blackList` | `array` |  | Resources in the blackList will not be selected. |
