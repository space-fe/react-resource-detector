# react-resource-detector
A resource detector for React

## design
route resource config:
One of `select & detect` must be provided. If both are provided, select will be used in priority.
```javascript
[
  {
    type: 'resource1',
    regexp: /resource1\/\d/i,    // resource regexp
    select: (resourceId, matchResult, query) => resource, // Promise or not
    detect: (location, matchResult, query) => resource    // Promise or not
  }
]
```

Detect route resource when route changes.
Route resources will be stored in React context.
