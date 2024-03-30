import { describe, it, expect } from 'vitest'
import { factorial, fizzBuzz, max } from '../intro'

describe('Max test suite', () => {
  it('should return first argument if it greater than second argument', () => {
    expect(max(2, 1)).toBe(2)
  })

  it('should return second argument if it greater than first argument', () => {
    expect(max(2, 3)).toBe(3)
  })

  it('should return first argument if both of the are equal', () => {
    expect(max(1, 1)).toBe(1)
  })
})

describe('fizzBuzz', () => {
  it('should return FizzBuzz if arg is divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz')
  })

  it('should return Fizz if arg is only divisible by 3', () => {
    expect(fizzBuzz(9)).toBe('Fizz')
  })

  it('should return Buzz if arg is only divisible by 5', () => {
    expect(fizzBuzz(20)).toBe('Buzz')
  })

  it('should return arg as a string if it is not divisible by 3 or 5', () => {
    expect(fizzBuzz(16)).toBe('16')
  })
})

describe('factorial', () => {
  it('should return a NaN if givin negative number', () => {
    expect(factorial(-1)).toBe(NaN)
  })

  it('should return 1 if givin zero', () => {
    expect(factorial(0)).toBe(1)
  })

  it('should return 1 if givin 1', () => {
    expect(factorial(1)).toBe(1)
  })

  it('should return 2 if givin 2', () => {
    expect(factorial(2)).toBe(2)
  })

  it('should return 6 if givin 3', () => {
    expect(factorial(3)).toBe(6)
  })

  it('should return 3628800 if givin 10', () => {
    expect(factorial(10)).toBe(3628800)
  })
})
