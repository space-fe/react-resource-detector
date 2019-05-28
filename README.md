# react-resource-detector
A resource detector for React

## design
route resource config:
```javascript
[
  {
    resourceType: 'resource1',
    regexp: /resource1\/\d/i,    // resource regexp/string
    select: (resourceId, matchResult, query) => resource, // Promise or not
  },
  {
    regexp: /resource1\/\d/i,    // resource regexp/string
    detect: (location, matchResult, query) => resource    // Promise or not
  }
]
```

Detect route resource when route changes.
Route resources will be stored in React context.
