import _extends from '@babel/runtime/helpers/extends';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _slicedToArray from '@babel/runtime/helpers/slicedToArray';
import { createElement, useEffect as useEffect$1, useRef as useRef$1 } from 'react';
import onRouteChangedHOC from 'react-onroutechanged';
import _toArray from '@babel/runtime/helpers/toArray';
import pathToRegexp from 'path-to-regexp';

var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;

function compilePath(path, options) {
  var cacheKey = "".concat(options.start).concat(options.end).concat(options.strict).concat(options.sensitive);
  var pathCache = cache[cacheKey] || (cache[cacheKey] = {});
  if (pathCache[path]) return pathCache[path];
  var keys = [];
  var regexp = pathToRegexp(path, keys, options);
  var result = {
    regexp: regexp,
    keys: keys
  };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

function matchPath(pathname) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof options === 'string') options = {
    path: options
  };
  var _options = options,
      path = _options.path,
      _options$exact = _options.exact,
      exact = _options$exact === void 0 ? false : _options$exact,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      _options$sensitive = _options.sensitive,
      sensitive = _options$sensitive === void 0 ? false : _options$sensitive,
      _options$start = _options.start,
      start = _options$start === void 0 ? true : _options$start;
  var paths = [].concat(path);
  return paths.reduce(function (matched, path) {
    if (!path) return null;
    if (matched) return matched;

    var _compilePath = compilePath(path, {
      end: exact,
      start: start,
      strict: strict,
      sensitive: sensitive
    }),
        regexp = _compilePath.regexp,
        keys = _compilePath.keys;

    var match = regexp.exec(pathname);
    if (!match) return null;

    var _match = _toArray(match),
        url = _match[0],
        values = _match.slice(1);

    var isExact = pathname === url;
    if (exact && !isExact) return null;
    return {
      path: path,
      url: path === '/' && url === '' ? '/' : url,
      isExact: isExact,
      params: keys.reduce(function (memo, key, index) {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

var configDefaulter = function configDefaulter(value, defaultValue) {
  return value === undefined ? defaultValue : value;
};

var noop = function noop() {};

var useEffect = useEffect$1,
    useRef = useRef$1;

var routeResourceDetectorHOC = function routeResourceDetectorHOC(DecoratedComponent) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    shouldDetectResourceForAllRoutes: true,
    detectResourceInSequence: false
  };
  var componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
  var isReactComponent = DecoratedComponent.prototype && DecoratedComponent.prototype.isReactComponent;
  var shouldDetectResourceForAllRoutes = configDefaulter(config.shouldDetectResourceForAllRoutes, true);
  var detectResourceInSequence = configDefaulter(config.detectResourceInSequence, false);
  var resourceConfigurations;
  var routeConfigurations;

  var ResourceDetectorComponent = function ResourceDetectorComponent(props) {
    var instanceRef = useRef();

    var __getResourcesToBeDetected = function __getResourcesToBeDetected() {
      var whiteList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var blackList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var resourcesToBeDetected = Object.entries(resourceConfigurations).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            pattern = _ref2[0];

        return !blackList.includes(pattern);
      });

      if (whiteList.length) {
        resourcesToBeDetected = resourcesToBeDetected.filter(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 1),
              pattern = _ref4[0];

          return whiteList.includes(pattern);
        });
      }

      return resourcesToBeDetected;
    };

    var __detectResources =
    /*#__PURE__*/
    function () {
      var _ref5 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee(currLocation, resources) {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, pattern, configuration, _configuration$handle, handler, pathname, match;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 3;
                _iterator = resources[Symbol.iterator]();

              case 5:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 21;
                  break;
                }

                _step$value = _slicedToArray(_step.value, 2), pattern = _step$value[0], configuration = _step$value[1];
                _configuration$handle = configuration.handler, handler = _configuration$handle === void 0 ? noop : _configuration$handle;
                pathname = currLocation.pathname;
                match = matchPath(pathname, {
                  path: pattern,
                  start: false
                });

                if (match) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("continue", 18);

              case 12:
                if (!detectResourceInSequence) {
                  _context.next = 17;
                  break;
                }

                _context.next = 15;
                return handler(match.params, match.url, currLocation);

              case 15:
                _context.next = 18;
                break;

              case 17:
                handler(match.params, match.url, currLocation);

              case 18:
                _iteratorNormalCompletion = true;
                _context.next = 5;
                break;

              case 21:
                _context.next = 27;
                break;

              case 23:
                _context.prev = 23;
                _context.t0 = _context["catch"](3);
                _didIteratorError = true;
                _iteratorError = _context.t0;

              case 27:
                _context.prev = 27;
                _context.prev = 28;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 30:
                _context.prev = 30;

                if (!_didIteratorError) {
                  _context.next = 33;
                  break;
                }

                throw _iteratorError;

              case 33:
                return _context.finish(30);

              case 34:
                return _context.finish(27);

              case 35:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 23, 27, 35], [28,, 30, 34]]);
      }));

      return function __detectResources(_x, _x2) {
        return _ref5.apply(this, arguments);
      };
    }();

    var __triggerRouteHandlers = function __triggerRouteHandlers(currLocation) {
      var pathname = currLocation.pathname;
      var hasMatch = false;

      if (routeConfigurations) {
        var routeConfigs = Object.entries(routeConfigurations);

        for (var _i = 0, _routeConfigs = routeConfigs; _i < _routeConfigs.length; _i++) {
          var _routeConfigs$_i = _slicedToArray(_routeConfigs[_i], 2),
              pattern = _routeConfigs$_i[0],
              configuration = _routeConfigs$_i[1];

          var _configuration$handle2 = configuration.handler,
              handler = _configuration$handle2 === void 0 ? noop : _configuration$handle2,
              _configuration$exact = configuration.exact,
              exact = _configuration$exact === void 0 ? true : _configuration$exact,
              _configuration$whiteL = configuration.whiteList,
              whiteList = _configuration$whiteL === void 0 ? [] : _configuration$whiteL,
              _configuration$blackL = configuration.blackList,
              blackList = _configuration$blackL === void 0 ? [] : _configuration$blackL,
              _configuration$should = configuration.shouldDetectResource,
              shouldDetectResource = _configuration$should === void 0 ? true : _configuration$should;
          var match = matchPath(pathname, {
            path: pattern,
            exact: exact
          });

          if (!match) {
            continue;
          }

          hasMatch = true;
          handler(match.params, match.url, currLocation);

          if (!shouldDetectResource) {
            continue;
          }

          var resourcesToBeDetected = __getResourcesToBeDetected(whiteList, blackList);

          __detectResources(currLocation, resourcesToBeDetected);
        }
      }

      if (!hasMatch && shouldDetectResourceForAllRoutes) {
        var _resourcesToBeDetected = __getResourcesToBeDetected();

        __detectResources(currLocation, _resourcesToBeDetected);
      }
    };

    ResourceDetectorComponent.handleRouteChanged = function (_, currLocation) {
      __triggerRouteHandlers(currLocation);
    };

    useEffect(function () {
      if (isReactComponent) {
        resourceConfigurations = instanceRef.current.resourceConfigurations;
        routeConfigurations = instanceRef.current.routeConfigurations;
      } else {
        resourceConfigurations = DecoratedComponent.resourceConfigurations;
        routeConfigurations = DecoratedComponent.routeConfigurations;
      }

      if (!resourceConfigurations || !Object.keys(resourceConfigurations).length) {
        throw new Error("The resourceConfigurations of ".concat(componentName, " must be provided!"));
      }
    }, []);

    var allProps = _extends({}, props);

    if (isReactComponent) {
      allProps.ref = function (ref) {
        instanceRef.current = ref;
      };
    }

    return createElement(DecoratedComponent, allProps);
  };

  return onRouteChangedHOC(ResourceDetectorComponent, {
    mounted: true
  });
};

export default routeResourceDetectorHOC;
