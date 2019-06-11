import { PureComponent, createElement } from 'react';
import onRouteChangedHOC from 'react-onroutechanged';
import pathToRegexp from 'path-to-regexp';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const cache = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path, options) {
  const cacheKey = `${options.start}${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = {
    regexp,
    keys
  };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

function matchPath(pathname, options = {}) {
  if (typeof options === 'string') options = {
    path: options
  };
  const {
    path,
    exact = false,
    strict = false,
    sensitive = false,
    start = true
  } = options;
  const paths = [].concat(path);
  return paths.reduce((matched, path) => {
    if (!path) return null;
    if (matched) return matched;
    const {
      regexp,
      keys
    } = compilePath(path, {
      end: exact,
      start,
      strict,
      sensitive
    });
    const match = regexp.exec(pathname);
    if (!match) return null;
    const [url, ...values] = match;
    const isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path,
      url: path === '/' && url === '' ? '/' : url,
      isExact,
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

const noop = () => {};

const detectResource = (currLocation, pattern, configuration) => {
  const {
    handler = noop
  } = configuration;
  const {
    pathname
  } = currLocation;
  const match = matchPath(pathname, {
    path: pattern,
    start: false
  });

  if (match) {
    handler(match.params, match.url, currLocation);
  }
};
const detectResources = (currLocation, resourceConfigurations, whiteList = [], blackList = []) => {
  let resourcesToBeDetected = Object.entries(resourceConfigurations).filter(([pattern]) => !blackList.includes(pattern));

  if (whiteList.length) {
    resourcesToBeDetected = resourcesToBeDetected.filter(([pattern]) => whiteList.includes(pattern));
  }

  resourcesToBeDetected.forEach(([pattern, configuration]) => {
    detectResource(currLocation, pattern, configuration);
  });
};
const triggerHandlers = (currLocation, resourceConfigurations, routeConfigurations) => {
  const {
    pathname
  } = currLocation;
  let hasMatch = false;
  Object.entries(routeConfigurations).forEach(([pattern, configuration]) => {
    const {
      handler = noop,
      exact = true,
      shouldDetectResource = true,
      whiteList = [],
      blackList = []
    } = configuration;
    const match = matchPath(pathname, {
      path: pattern,
      exact
    });

    if (match) {
      hasMatch = true;
      handler(match.params, match.url, currLocation);

      if (shouldDetectResource) {
        detectResources(currLocation, resourceConfigurations, whiteList, blackList);
      }
    }
  });

  if (!hasMatch) {
    detectResources(currLocation, resourceConfigurations);
  }
};

const routeResourceDetectorHOC = DecoratedComponent => {
  const componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
  const isReactComponent = DecoratedComponent.prototype.isReactComponent;

  class ResourceDetectorComponent extends PureComponent {
    constructor(...args) {
      super(...args);

      _defineProperty(this, "__getConfigurations", () => {
        let resourceConfigurations;
        let routeConfigurations;

        if (isReactComponent) {
          resourceConfigurations = this.instanceRef.resourceConfigurations;
          routeConfigurations = this.instanceRef.routeConfigurations;
        } else {
          resourceConfigurations = DecoratedComponent.resourceConfigurations;
          routeConfigurations = DecoratedComponent.routeConfigurations;
        }

        return {
          resourceConfigurations,
          routeConfigurations
        };
      });

      _defineProperty(this, "handleRouteChanged", (prevLocation, currLocation) => {
        const configs = this.__getConfigurations();

        const {
          resourceConfigurations,
          routeConfigurations
        } = configs;
        triggerHandlers(currLocation, resourceConfigurations, routeConfigurations);
      });
    }

    componentDidMount() {
      const {
        resourceConfigurations
      } = this.__getConfigurations();

      if (!resourceConfigurations || !Object.keys(resourceConfigurations).length) {
        throw new Error(`The resourceConfigurations of ${DecoratedComponent} must be provided!`);
      }
    }

    render() {
      const { ...props
      } = this.props;

      if (isReactComponent) {
        props.ref = ref => {
          this.instanceRef = ref;
        };
      }

      return createElement(DecoratedComponent, props);
    }

  }

  _defineProperty(ResourceDetectorComponent, "displayName", `RouteResourceDetector(${componentName})`);

  return onRouteChangedHOC(ResourceDetectorComponent, {
    mounted: true
  });
};

export default routeResourceDetectorHOC;
