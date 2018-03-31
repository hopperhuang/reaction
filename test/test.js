import proxy, { beProxied } from '../src/proxy'

const assert = require('assert')
describe('test beproxyed', function () {
  describe('get', function () {
    it('should return name\'s value', function () {
      const person = beProxied({name: 'hopperhuang'})
      assert.equal(person.name, 'hopperhuang')
    })
  })
  describe('set', function () {
    it('should return name\'s value', function () {
      const person = beProxied({name: 'hopperhuang'})
      person.name = 'hopper'
      assert.equal(person.name, 'hopper')
    })
  })
  describe('has', function () {
    it('should return true, when it contains the property', function () {
      const person = beProxied({name: 'hoperhuang'})
      assert.equal('name' in person, true)
    })
  })
  describe('deleteProperty', function () {
    it('return undefined after delete property', function () {
      const person = beProxied({name: 'hopperhuang'})
      delete person.name
      assert.equal(person.name, undefined)
    })
  })
  describe('defineProperty', function () {
    it('should throw an error when define properties', function () {
      const throwError = () => {
        const person = beProxied({name: 'hopperhuang'})
        Object.defineProperty(person, 'name', {
          value: 'hopper',
          writable: false
        })
      }
      assert.throws(throwError, Error, 'define property is forbidden')
    })
  })
  describe('getOwnPropertyDescriptor', function () {
    it('return the same value as default', function () {
      const object = {name: 'hopperhuang'}
      const person = beProxied(object)
      assert.equal(Reflect.getOwnPropertyDescriptor(person, 'name')['name'], Reflect.getOwnPropertyDescriptor(object, 'name')['name'])
      assert.equal(Reflect.getOwnPropertyDescriptor(person, 'name')['writable'], Reflect.getOwnPropertyDescriptor(object, 'name')['writable'])
      assert.equal(Reflect.getOwnPropertyDescriptor(person, 'name')['enumerable'], Reflect.getOwnPropertyDescriptor(object, 'name')['enumerable'])
      assert.equal(Reflect.getOwnPropertyDescriptor(person, 'name')['configurable'], Reflect.getOwnPropertyDescriptor(object, 'name')['configurable'])
    })
  })
  describe('setPrototypeOf', function () {
    it('should throw error when set property', function () {
      const person = beProxied({name: 'hopperhuang'})
      const throwError = () => {
        Object.setPrototypeOfI(person, {})
      }
      assert.throws(throwError, Error, 'Changing the prototype is forbidden')
    })
  })
  describe('isExtensible', function () {
    it('default to be true', function () {
      const person = beProxied({name: 'person'})
      assert.equal(Reflect.isExtensible(person), true)
    })
  })
  describe('ownKeys', function () {
    it('return correct length', function () {
      const person = beProxied({name: 'hopperhuang'})
      assert.equal(Reflect.ownKeys(person).length, 1)
    })
  })
  describe('preventExtensions', function () {
    it('return false after prenventExtensions', function () {
      const person = beProxied({name: 'hopperhuang'})
      Object.preventExtensions(person)
      assert.equal(Reflect.isExtensible(person), false)
    })
  })
})
describe('test proxy', function () {
  describe('proxy array', function () {
    it('expected array and it\'s object children $proxied property to be true', function () {
      const array = proxy([{name: 'hopperhuang'}])
      assert.equal(array.$proxied, true)
      assert.equal(array[0].$proxied, true)
    })
  })
  describe('proxy object', function () {
    it('expected object\'s object children $proxied property to be true', function () {
      const object = proxy({
        person: {name: 'hopperhuang'},
        skills: {
          name: 'draw',
          rank: {
            score: {
              seasonOne: 10
            }
          }
        }
      })
      assert.equal(object.$proxied, true)
      assert.equal(object.person.$proxied, true)
      assert.equal(object.skills.$proxied, true)
      assert.equal(object.skills.rank.$proxied, true)
      assert.equal(object.skills.rank.score.$proxied, true)
    })
  })
  describe('proxy string', function () {
    it('expected throw an error', function () {
      const throwError = () => {
        var name = 'hopperhuang'
        proxy(name)
      }
      assert.throws(throwError, Error, 'proxied target must be a object but not null or an array')
    })
  })
  describe('proxy number', function () {
    it('expected throw an error', function () {
      const throwError = () => {
        var number = 1
        proxy(number)
      }
      assert.throws(throwError, Error, 'proxied target must be a object but not null or an array')
    })
  })
  describe('proxy boolean', function () {
    it('should throw an error', function () {
      const throwError = () => {
        proxy(true)
      }
      assert.throws(throwError, Error, 'proxied target must be a object but not null or an array')
    })
  })
  describe('proxy function', function () {
    it('should throw an error', function () {
      const throwError = () => {
        proxy(() => {})
      }
      assert.throws(throwError, Error, 'proxied target must be a object but not null or an array')
    })
  })
  describe('proxy null', function () {
    it('should throw an error', function () {
      const throwError = () => {
        proxy(null)
      }
      assert.throws(throwError, Error, 'proxied target must be a object but not null or an array')
    })
    describe('proxy undefined', () => {
      it('should throw an error', () => {
        const throwError = () => {
          proxy(undefined)
        }
        assert.throws(throwError, Error, 'proxied target must be a object but not null or an array')
      })
    })
  })
})
