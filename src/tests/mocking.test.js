import { vi, it, expect, describe } from 'vitest'
import { getExchangeRate } from '../libs/currency'
import {
  getDiscount,
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from '../mocking'
import { getShippingQuote } from '../libs/shipping'
import { trackPageView } from '../libs/analytics'
import { charge } from '../libs/payment'
import { sendEmail } from '../libs/email'
import security from '../libs/security'

vi.mock('../libs/currency.js')
vi.mock('../libs/shipping.js')
vi.mock('../libs/analytics.js')
vi.mock('../libs/payment.js')
vi.mock('../libs/email.js', async (importOriginal) => {
  const originalModule = await importOriginal()
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  }
})

describe('try mocking function', () => {
  it('should', async () => {
    const greeting = vi.fn()
    // greeting.mockReturnValue('hello')
    // greeting.mockResolvedValue('Hello')
    greeting.mockImplementation((name) => 'Hello ' + name)

    let result = await greeting('ahmed')
    // result = await greeting('Eid')

    expect(greeting).toHaveBeenCalledWith('ahmed')
  })
})

describe('sendText', () => {
  it('should', () => {
    const sendText = vi.fn().mockReturnValue('Ok')

    const result = sendText('message')

    expect(sendText).toHaveBeenCalledWith('message')
    expect(result).toMatch(/ok/i)
  })
})

describe('getPriceInCurrency', () => {
  it('should return conversion currency in AUD', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5)

    const result = getPriceInCurrency(10, 'AUD')

    expect(result).toBe(15)
  })
})

describe('getShippingInfo', () => {
  it('should return "Shipping Unavailable" if quote cannot be fetched', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null)

    const shippingInfo = getShippingInfo('Egypt')

    expect(shippingInfo).toMatch(/unavailable/i)
  })

  it('should return shipping cost & estimated days"', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 15, estimatedDays: 2 })

    const shippingInfo = getShippingInfo('Egypt')

    expect(shippingInfo).toMatch('$15')
    expect(shippingInfo).toMatch(/2 days/i)
  })
})

describe('renderPage', () => {
  it('should return a content', async () => {
    const result = await renderPage()

    expect(result).toMatch(/content/i)
  })

  it('should call analytics ', async () => {
    await renderPage()
    expect(trackPageView).toHaveBeenCalledWith('/home')
  })
})

describe('submitOrder', () => {
  const order = { totalAmount: 19 }
  const creditCard = { creditCardNumber: 51445455454 }

  it('should charge user', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' })

    const result = await submitOrder(order, creditCard)

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount)
  })

  it('should return success if passing valid credit card info', async () => {
    vi.mocked(charge).mockResolvedValue({ status: 'success' })

    const result = await submitOrder(order, creditCard)

    expect(result).toMatchObject({ success: true })
  })

  it('should return payment error if passing invalid credit card info', async () => {
    vi.mocked(charge).mockReturnValue({ status: 'failed' })

    const result = await submitOrder(order, creditCard)

    expect(result).toMatchObject({ success: false, error: 'payment_error' })
  })
})

describe('signUp', () => {
  const email = 'ahmed.eid3@outlook.com'

  it('should return true if email is valid', async () => {
    const result = await signUp(email)

    expect(result).toBe(true)
  })

  it('should return false if email is invalid', async () => {
    const result = await signUp('as')

    expect(result).toBe(false)
  })

  it('should send welcome email if new register', async () => {
    await signUp(email)

    expect(sendEmail).toHaveBeenCalled()
    // expect(sendEmail).toHaveBeenCalledWith(email, 'Welcome aboard!')
    const args = vi.mocked(sendEmail).mock.calls[0]
    expect(args[0]).toBe(email)
    expect(args[1]).toMatch(/welcome/i)
  })
})

describe('login', () => {
  const email = 'ahmed.eid3@outlook.com'

  it('should generate one-time-passcode @ login', async () => {
    const spy = vi.spyOn(security, 'generateCode')

    await login(email)

    const securityCode = spy.mock.results[0].value.toString()

    expect(sendEmail).toHaveBeenCalledWith(email, securityCode)
  })
})

describe('isOnline', () => {
  it('should return false if restaurant close before 8 am', () => {
    vi.setSystemTime('2024-04-01 07:59')

    const result = isOnline()

    expect(result).toBe(false)
  })

  it('should return false if restaurant close after 20pm', () => {
    vi.setSystemTime('2024-04-01 20:01')

    const result = isOnline()

    expect(result).toBe(false)
  })

  it('should return true if restaurant open at 08 AM', () => {
    vi.setSystemTime('2024-04-01 08:00')

    const result = isOnline()

    expect(result).toBe(true)
  })

  it('should return true if restaurant open before 20 pm', () => {
    vi.setSystemTime('2024-04-01 19:59')

    const result = isOnline()

    expect(result).toBe(true)
  })
})

describe('getDiscount', () => {
  it('should return 0.2 on christmas day', () => {
    vi.setSystemTime('2023-12-25 00:01')
    expect(getDiscount()).toBe(0.2)

    vi.setSystemTime('2023-12-25 23:59')
    expect(getDiscount()).toBe(0.2)
  })

  it('should return 0 outside of christmas day', () => {
    vi.setSystemTime('2023-12-24 00:01')
    expect(getDiscount()).toBe(0)

    vi.setSystemTime('2023-12-26 00:01')
    expect(getDiscount()).toBe(0)
  })
})
