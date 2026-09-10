import {
  clone,
  shallowClone,
  uid,
  Subscribable,
  globalThisPolyfill,
  LRUMap,
  requestIdle,
  cancelIdle,
  compose,
  isFn,
  isArr,
  isPlainObj,
  isStr,
  isBool,
  isNum,
  isObj,
  isValidNumber,
  isHTMLElement,
  calcDistancePointToEdge,
  calcSpeedFactor,
} from '../index'

describe('@thienvu18/designable-shared', () => {
  describe('clone utilities', () => {
    it('should deep clone plain objects and arrays', () => {
      const original = {
        a: 1,
        b: [1, 2, { c: 'hello' }],
        d: { nested: true },
      }
      const cloned = clone(original)
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).not.toBe(original.b)
      expect(cloned.b[2]).not.toBe(original.b[2])
    })

    it('should shallow clone objects and arrays', () => {
      const nested = { c: 1 }
      const original = { a: 1, b: nested }
      const cloned = shallowClone(original)
      expect(cloned).toEqual(original)
      expect(cloned).not.toBe(original)
      expect(cloned.b).toBe(original.b)
    })

    it('should handle primitive types gracefully', () => {
      expect(clone(42)).toBe(42)
      expect(clone('test')).toBe('test')
      expect(clone(null)).toBeNull()
      expect(clone(undefined)).toBeUndefined()
    })
  })

  describe('uid', () => {
    it('should generate unique strings', () => {
      const id1 = uid()
      const id2 = uid()
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
      expect(id1).not.toBe(id2)
    })

    it('should support custom length', () => {
      const id = uid(16)
      expect(id.length).toBe(16)
    })
  })

  describe('Subscribable', () => {
    it('should subscribe and notify subscribers', () => {
      const subscribable = new Subscribable()
      const fn = jest.fn()
      const unsubscribe = subscribable.subscribe(fn)

      subscribable.dispatch({ type: 'test', payload: 123 })
      expect(fn).toHaveBeenCalledWith(expect.objectContaining({ type: 'test', payload: 123 }))

      unsubscribe()
      subscribable.dispatch({ type: 'test2' })
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple subscribers and unsubscriptions', () => {
      const subscribable = new Subscribable()
      const fn1 = jest.fn()
      const fn2 = jest.fn()

      const unsub1 = subscribable.subscribe(fn1)
      const unsub2 = subscribable.subscribe(fn2)

      subscribable.dispatch({ type: 'event' })
      expect(fn1).toHaveBeenCalledWith(expect.objectContaining({ type: 'event' }))
      expect(fn2).toHaveBeenCalledWith(expect.objectContaining({ type: 'event' }))

      unsub1()
      subscribable.dispatch({ type: 'event2' })
      expect(fn1).toHaveBeenCalledTimes(1)
      expect(fn2).toHaveBeenCalledTimes(2)

      unsub2()
      subscribable.dispatch({ type: 'event3' })
      expect(fn2).toHaveBeenCalledTimes(2)
    })
  })

  describe('globalThisPolyfill', () => {
    it('should return global environment object', () => {
      expect(globalThisPolyfill).toBeDefined()
      expect(typeof globalThisPolyfill).toBe('object')
    })
  })

  describe('LRUMap', () => {
    it('should manage cache with capacity limit', () => {
      const lru = new LRUMap<string, number>(2)
      lru.set('a', 1)
      lru.set('b', 2)
      expect(lru.get('a')).toBe(1)
      expect(lru.get('b')).toBe(2)

      lru.set('c', 3)
      expect(lru.get('a')).toBeUndefined()
      expect(lru.get('b')).toBe(2)
      expect(lru.get('c')).toBe(3)
    })

    it('should update recent status on get', () => {
      const lru = new LRUMap<string, number>(2)
      lru.set('a', 1)
      lru.set('b', 2)
      lru.get('a') // touch 'a'
      lru.set('c', 3) // evicts 'b'
      expect(lru.get('a')).toBe(1)
      expect(lru.get('b')).toBeUndefined()
      expect(lru.get('c')).toBe(3)
    })
  })

  describe('requestIdle & cancelIdle', () => {
    it('should schedule and execute idle callback', (done) => {
      const id = requestIdle(() => {
        done()
      })
      expect(id).toBeDefined()
    })

    it('should cancel idle callback', (done) => {
      const fn = jest.fn()
      const id = requestIdle(fn)
      cancelIdle(id)
      setTimeout(() => {
        expect(fn).not.toHaveBeenCalled()
        done()
      }, 50)
    })
  })

  describe('compose', () => {
    it('should compose multiple functions in sequence', () => {
      const add1 = (n: number) => n + 1
      const double = (n: number) => n * 2
      const square = (n: number) => n * n

      const composed = compose(add1, double, square)
      // ((2 + 1) * 2) ^ 2 = (3 * 2) ^ 2 = 6 ^ 2 = 36
      expect(composed(2)).toBe(36)
    })
  })

  describe('type checkers', () => {
    it('should correctly check types', () => {
      expect(isFn(() => {})).toBe(true)
      expect(isFn(123)).toBe(false)

      expect(isArr([1, 2])).toBe(true)
      expect(isArr({})).toBe(false)

      expect(isPlainObj({ a: 1 })).toBe(true)
      expect(isPlainObj([])).toBe(false)

      expect(isStr('str')).toBe(true)
      expect(isStr(123)).toBe(false)

      expect(isBool(true)).toBe(true)
      expect(isBool(false)).toBe(true)
      expect(isBool(0)).toBe(false)

      expect(isNum(123)).toBe(true)
      expect(isNum('123')).toBe(false)

      expect(isObj({})).toBe(true)
      expect(isObj([])).toBe(true)

      expect(isValidNumber(123)).toBe(true)
      expect(isValidNumber(NaN)).toBe(false)
    })

    it('should check HTMLElement', () => {
      const div = document.createElement('div')
      expect(Boolean(isHTMLElement(div))).toBe(true)
      expect(Boolean(isHTMLElement({}))).toBe(false)
      expect(Boolean(isHTMLElement(null))).toBe(false)
    })
  })

  describe('coordinate & calculation utilities', () => {
    it('calcDistancePointToEdge should calculate correctly', () => {
      const distance = calcDistancePointToEdge({ x: 0, y: 0 }, {
        x: 10,
        y: 10,
        width: 100,
        height: 100,
        top: 10,
        left: 10,
        right: 110,
        bottom: 110,
      } as any)
      expect(distance).toBeGreaterThan(0)
    })

    it('calcSpeedFactor should calculate speed factor based on delta', () => {
      const factor = calcSpeedFactor(10, 50)
      expect(factor).toBeGreaterThan(0)
    })
  })
})
