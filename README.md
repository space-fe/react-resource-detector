# react-resource-detector
A resource detector for React

## design
route resource config:
One of `select & detect` must be provided. If both are provided, detect will be used in priority.
```javascript
[
  {
    type: 'service',
    regexp: /service_categories\/\d\/services\/\d/i,
    select: resourceId => resource, // Promise or not
    detect: url => resource         // Promise or not
  }
]
```

Detect route resource when route changes.
Route resources will be stored in React context.
