import { configDefaulter } from '../src/helpers/config'
import cases from 'jest-in-case'

cases('test config helper function', opts => {
  const { data, expectedResult } = opts
  const [value, defaultValue] = data
  expect(configDefaulter(value, defaultValue)).toBe(expectedResult)
}, [
  {
    name: 'If value is undefined, then return the default value',
    data: [undefined, true],
    expectedResult: true
  },
  {
    name: 'If value is not undefined, then return the value',
    data: [false, true],
    expectedResult: false
  }
])
