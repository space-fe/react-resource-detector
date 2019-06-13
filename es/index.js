import { createElement, PureComponent } from 'react';
import onRouteChangedHOC from 'react-onroutechanged';
import pathToRegexp from 'path-to-regexp';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

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

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

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

var noop = function noop() {};

var routeResourceDetectorHOC = function routeResourceDetectorHOC(DecoratedComponent) {
  var componentName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';
  var isReactComponent = DecoratedComponent.prototype.isReactComponent;
  var resourceConfigurations;
  var routeConfigurations;

  var ResourceDetectorComponent =
  /*#__PURE__*/
  function (_React$PureComponent) {
    _inherits(ResourceDetectorComponent, _React$PureComponent);

    function ResourceDetectorComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ResourceDetectorComponent);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ResourceDetectorComponent)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "__getResourcesToBeDetected", function () {
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
      });

      _defineProperty(_assertThisInitialized(_this), "__detectResources", function (currLocation, resources) {
        resources.forEach(function (_ref5) {
          var _ref6 = _slicedToArray(_ref5, 2),
              pattern = _ref6[0],
              configuration = _ref6[1];

          var _configuration$handle = configuration.handler,
              handler = _configuration$handle === void 0 ? noop : _configuration$handle;
          var pathname = currLocation.pathname;
          var match = matchPath(pathname, {
            path: pattern,
            start: false
          });

          if (match) {
            handler(match.params, match.url, currLocation);
          }
        });
      });

      _defineProperty(_assertThisInitialized(_this), "__triggerRouteHandlers", function (currLocation) {
        var pathname = currLocation.pathname;
        var hasMatch = false;

        if (routeConfigurations) {
          Object.entries(routeConfigurations).forEach(function (_ref7) {
            var _ref8 = _slicedToArray(_ref7, 2),
                pattern = _ref8[0],
                configuration = _ref8[1];

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

            if (match) {
              hasMatch = true;
              handler(match.params, match.url, currLocation);

              if (shouldDetectResource) {
                var resourcesToBeDetected = _this.__getResourcesToBeDetected(whiteList, blackList);

                _this.__detectResources(currLocation, resourcesToBeDetected);
              }
            }
          });
        }

        if (!hasMatch) {
          var resourcesToBeDetected = _this.__getResourcesToBeDetected();

          _this.__detectResources(currLocation, resourcesToBeDetected);
        }
      });

      _defineProperty(_assertThisInitialized(_this), "handleRouteChanged", function (_, currLocation) {
        _this.__triggerRouteHandlers(currLocation);
      });

      return _this;
    }

    _createClass(ResourceDetectorComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (isReactComponent) {
          resourceConfigurations = this.instanceRef.resourceConfigurations;
          routeConfigurations = this.instanceRef.routeConfigurations;
        } else {
          resourceConfigurations = DecoratedComponent.resourceConfigurations;
          routeConfigurations = DecoratedComponent.routeConfigurations;
        }

        if (!resourceConfigurations || !Object.keys(resourceConfigurations).length) {
          throw new Error("The resourceConfigurations of ".concat(componentName, " must be provided!"));
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this2 = this;

        var props = _extends({}, this.props);

        if (isReactComponent) {
          props.ref = function (ref) {
            _this2.instanceRef = ref;
          };
        }

        return createElement(DecoratedComponent, props);
      }
    }]);

    return ResourceDetectorComponent;
  }(PureComponent);

  _defineProperty(ResourceDetectorComponent, "displayName", "RouteResourceDetector(".concat(componentName, ")"));

  return onRouteChangedHOC(ResourceDetectorComponent, {
    mounted: true
  });
};

export default routeResourceDetectorHOC;
