import matchPath from '../src/helpers/matchPath'
import cases from 'jest-in-case'

cases('test matchPath helper function', opts => {
  const { pathname, options, expectedResult } = opts
  expect(matchPath(pathname, options)).toEqual(expectedResult)
}, [
  {
    name: 'If options is not provided',
    pathname: '/class/1',
    expectedResult: null
  },
  {
    name: 'If options is a string',
    pathname: '/class/1',
    options: '/class/:classId',
    expectedResult: {
      path: '/class/:classId',
      url: '/class/1',
      isExact: true,
      params: {
        classId: '1'
      }
    }
  },
  {
    name: 'If options is an object: exact=true, strict=true, sensitive=true, start=true',
    pathname: '/class/1',
    options: {
      path: '/class/:classId',
      exact: true,
      strict: true,
      sensitive: true,
      start: true
    },
    expectedResult: {
      path: '/class/:classId',
      url: '/class/1',
      isExact: true,
      params: {
        classId: '1'
      }
    }
  },
  {
    name: 'If options is an object: path is an array, exact=false, strict=true, sensitive=true, start=true',
    pathname: '/class/1/student/1',
    options: {
      path: ['/student/:studentId', '/class/:classId'],
      exact: false,
      strict: true,
      sensitive: true,
      start: true
    },
    expectedResult: {
      path: '/class/:classId',
      url: '/class/1',
      isExact: false,
      params: {
        classId: '1'
      }
    }
  },
  {
    name: 'If options is an object: path is an array, exact=false, strict=false, sensitive=true, start=true',
    pathname: '/class/1/student/1',
    options: {
      path: ['/student/:studentId', '/class/:classId'],
      exact: false,
      strict: true,
      sensitive: true,
      start: false
    },
    expectedResult: {
      path: '/student/:studentId',
      url: '/student/1',
      isExact: false,
      params: {
        studentId: '1'
      }
    }
  }
])
