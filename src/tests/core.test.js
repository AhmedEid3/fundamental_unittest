import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import {
  Stack,
  calculateDiscount,
  canDrive,
  createProduct,
  fetchData,
  getCoupons,
  isPriceInRange,
  isStrongPassword,
  isValidUsername,
  validateUserInput,
} from '../core'

// Writing good assertions
describe('getCoupons', () => {
  it('should return an array of coupons', () => {
    expect(Array.isArray(getCoupons())).toBe(true)
    expect(getCoupons().length).toBeGreaterThan(0)
  })

  it('should return an array with valid coupon code', () => {
    getCoupons().forEach((coupon) => {
      expect(coupon).toHaveProperty('code')
      expect(typeof coupon.code).toBe('string')
      expect(coupon.code).toBeTruthy()
    })
  })

  it('should discount between 0 and 1', () => {
    getCoupons().forEach((coupon) => {
      expect(coupon).toHaveProperty('discount')
      expect(typeof coupon.discount).toBe('number')
      expect(coupon.discount).greaterThanOrEqual(0)
      expect(coupon.discount).lessThanOrEqual(1)
    })
  })
})

// Positive and negative testing
describe('calculateDiscount', () => {
  it('should return discounted price after given valid code', () => {
    expect(calculateDiscount(10, 'SAVE10')).toBe(9)
    expect(calculateDiscount(10, 'SAVE20')).toBe(8)
  })

  it('should handle non-numeric price', () => {
    expect(calculateDiscount('10', 'SAVE10')).toMatch(/invalid/i)
  })

  it('should handle zero or negative price', () => {
    expect(calculateDiscount(0, 'SAVE10')).toMatch(/invalid/i)
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i)
  })

  it('should handle non-string discount code', () => {
    expect(calculateDiscount(10, 41)).toMatch(/invalid/i)
  })

  it('should handle invalid discount code', () => {
    expect(calculateDiscount(10, 'INVALID')).toBe(10)
  })
})

// Positive and negative testing
describe('validateUserInput', () => {
  it('should return success if given valid input', () => {
    expect(validateUserInput('Ahmed', 31)).toMatch(/success/i)
  })

  it('should return an error if username non-string', () => {
    expect(validateUserInput(15, 31)).toMatch(/invalid/i)
  })

  it('should return an error if username less than 3 char', () => {
    expect(validateUserInput('ah', 31)).toMatch(/invalid/i)
  })

  it('should return an error if username greater than 255 char', () => {
    expect(validateUserInput('a'.repeat(256), 31)).toMatch(/invalid/i)
  })

  it('should return an error if age non-numeric', () => {
    expect(validateUserInput('Ahmed', '31')).toMatch(/invalid/i)
  })

  it('should return an error if a age under 18', () => {
    expect(validateUserInput('Ahmed', 17)).toMatch(/invalid/i)
  })

  it('should return an error if a age greater than 100', () => {
    expect(validateUserInput('Ahmed', 101)).toMatch(/invalid/i)
  })

  it('should return an error if both username and age are invalid', () => {
    expect(validateUserInput('', 3)).toMatch(/invalid username/i)
    expect(validateUserInput('', 3)).toMatch(/invalid age/i)
  })
})

// Boundary testing
describe('isValidUsername', () => {
  const minLength = 5
  const maxLength = 15

  it('should return false if username too short', () => {
    expect(isValidUsername('a'.repeat(minLength - 1))).toBe(false)
  })

  it('should return false if username too long', () => {
    expect(isValidUsername('a'.repeat(maxLength + 1))).toBe(false)
  })

  it('should return true if username is at min or max length', () => {
    expect(isValidUsername('a'.repeat(minLength))).toBe(true)
    expect(isValidUsername('a'.repeat(maxLength))).toBe(true)
  })

  it('should return true if username between the range', () => {
    expect(isValidUsername('a'.repeat(minLength + 1))).toBe(true)
    expect(isValidUsername('a'.repeat(maxLength - 1))).toBe(true)
  })

  it('should return false if given invalid input types', () => {
    expect(isValidUsername(null)).toBe(false)
    expect(isValidUsername(undefined)).toBe(false)
    expect(isValidUsername(1)).toBe(false)
  })
})

// Boundary testing
describe('canDrive', () => {
  const legalDrivingAge = {
    US: 16,
    UK: 17,
  }

  it('should return error for invalid country code ', () => {
    expect(canDrive(18, 'EG')).toMatch(/invalid/i)
  })

  it('should return false for under age', () => {
    Object.entries(legalDrivingAge).forEach((entry) => {
      expect(canDrive(entry[1] - 1, entry[0])).toBe(false)
    })
  })

  it('should return true for min age to country', () => {
    Object.entries(legalDrivingAge).forEach((entry) => {
      expect(canDrive(entry[1], entry[0])).toBe(true)
    })
  })

  it('should return true for eligible in country', () => {
    Object.entries(legalDrivingAge).forEach((entry) => {
      expect(canDrive(18, entry[0])).toBe(true)
    })
  })
})

// Parametrized Test
describe('isPriceInRange', () => {
  const itEach = it.each([
    {
      scenario: 'price < min',
      price: -10,
      result: false,
    },
    {
      scenario: 'price = min',
      price: 1,
      result: true,
    },
    {
      scenario: 'price between min and max',
      price: 50,
      result: true,
    },
    { scenario: 'price = max', price: 100, result: true },
    {
      scenario: 'price > max',
      price: 200,
      result: false,
    },
  ])

  itEach(
    'should return $result when $scenario',
    ({ price, scenario, result }) => {
      expect(isPriceInRange(price, 0, 100)).toBe(result)
    },
  )
})

describe('fetchData', () => {
  it('should return a promise array of numbers', async () => {
    try {
      const result = await fetchData()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      result.forEach((element) => {
        expect(typeof element).toBe('number')
      })
    } catch (error) {
      expect(error).toHaveProperty('message')
      expect(error.message).toMatch(/fail/i)
    }
  })
})

describe('Stack', () => {
  /**
   *
   * @type {Stack} stack
   */

  let stack
  beforeEach(() => {
    stack = new Stack()
  })

  it('push should add item to the stack', () => {
    stack.push(1)

    expect(stack.size()).toBeGreaterThan(0)
  })

  it('pop should remove and return the top item in the stack', () => {
    stack.push(1)
    stack.push(2)

    const popItem = stack.pop()

    expect(popItem).toBe(2)
    expect(stack.size()).toBe(1)
  })

  it('pop should throw an error is stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i)
  })

  it('peek should return the top item in the stack', () => {
    stack.push(2)
    stack.push(3)

    expect(stack.peek()).toBe(3)
    expect(stack.size()).toBe(2)
  })

  it('peek should throw an error is stack is empty', () => {
    expect(() => stack.peek()).toThrow(/empty/i)
  })

  it('isEmpty should return true if stack has no items', () => {
    expect(stack.isEmpty()).toBe(true)
  })

  it('isEmpty should return true if stack has items', () => {
    stack.push(2)

    expect(stack.isEmpty()).toBe(false)
  })

  it('size should return length of the stack', () => {
    stack.push(3)
    stack.push(4)
    stack.push(5)

    expect(stack.size()).toBe(3)
  })

  it('clear should empty stack', () => {
    stack.push(5)
    stack.push(9)
    stack.push(7)

    stack.clear()

    expect(stack.size()).toBe(0)
  })
})

describe('createProduct', () => {
  it('should return throw error if given non-value', () => {
    expect(() => createProduct()).toThrow(/empty product/i)
  })

  it('should return invalid name error when  name of product has not value', () => {
    const product = { name: '', price: 10 }

    expect(createProduct(product)).toMatchObject({ success: false })
    expect(createProduct(product)).toMatchObject({
      error: { code: 'invalid_name', message: /missing/i },
    })
  })

  it('should return invalid price error when price of product equal to zero', () => {
    const product = { name: 'iPhone', price: 0 }

    expect(createProduct(product)).toMatchObject({ success: false })
    expect(createProduct(product)).toMatchObject({
      error: { code: 'invalid_price', message: /missing/i },
    })
  })

  it('should return successful published product', () => {
    const product = { name: 'iPhone', price: 1200 }

    expect(createProduct(product)).toMatchObject({
      success: true,
      message: /successful/i,
    })
  })
})

describe('isStrongPassword', () => {
  it('Should return false if password less than 8 characters', () => {
    expect(isStrongPassword('a'.repeat(4))).toBe(false)
  })

  it('should return false if not has at least one uppercase letter', () => {
    expect(isStrongPassword('adssdcsd')).toBe(false)
  })

  it('should return false if not has at least one lowercase letter', () => {
    expect(isStrongPassword('AAAAAAAAA')).toBe(false)
  })

  it('should return false if not has at least one digit', () => {
    expect(isStrongPassword('aSasasdxdsds')).toBe(false)
  })
  it('should return true if all criteria are met', () => {
    expect(isStrongPassword('Aa1fjsldkffdsf2j')).toBe(true)
  })
})
