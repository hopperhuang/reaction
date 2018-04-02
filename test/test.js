import { beProxied } from '../src/proxy'
import proxy from '../src/index'

const assert = require('assert')
describe('test beproxyed', function () {
  describe('get', function () {
    it('should return name\'s value', function () {
      const person = beProxied({name: 'hopperhuang'})
      assert.equal(person.name, 'hopperhuang')
    })
  })
  describe('set', function () {
    it('should throw an error, beProxied should not be called alone, for a object to be proxied must hava listener and emit by default', function () {
      const throwError = () => {
        const person = beProxied({name: 'hopperhuang'})
        person.name = 'hopper'
      }
      assert.throws(throwError, Error)
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
      const array = proxy([])
      array[0] = 1
      assert.equal(array.$proxied, true)
    })
  })
  describe('proxy object', function () {
    it('expected object\'s object children $proxied property to be true', function () {
      const object = proxy({})
      object.a = 1
      assert(object.$proxied, true)
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
  })
  describe('proxy undefined', () => {
    it('should throw an error', () => {
      const throwError = () => {
        proxy(undefined)
      }
      assert.throws(throwError, Error, 'proxied target must be a object but not null or an array')
    })
  })
  describe('test listen and emit when target is object', () => {
    it('should add one when new value is setted', () => {
      const object = proxy({})
      let number = 1
      object.$listen('event', (object) => {
        number += object.number
      })
      object.number = 2
      assert.equal(number, 3)
    })
    it('child can also listen', () => {
      const object = proxy({})
      object.person = {name: 'hopperhuang'}
      let name = ''
      object.person.$listen('event', (person) => {
        name = person.name
      })
      object.person.name = 'hopper'
      assert.equal(name, 'hopper')
    })
  })
  describe('test listen and emit when target is array', () => {
    it('should add one when new value is settend', () => {
      const array = proxy([])
      let number = 1
      array.$listen('event', (array) => {
        number += array[0]
      })
      array[0] = 1
      assert.equal(number, 2)
    })
    it('child can also listen', () => {
      const array = proxy([{name: 'hopperhuang'}])
      let name = ''
      array[0].$listen('event', (element) => {
        name = element.name
      })
      array[0].name = 'hopper'
      assert.equal(name, 'hopper')
    })
  })
  describe('the same event listener will be coverd', function () {
    it('should react to the second listener for the first one is overwriten', function () {
      const object = proxy({})
      let name = ''
      object.$listen('event', (obj) => {
        name = obj.name
      })
      object.$listen('event', (obj) => {
        name = obj.nickname
      })
      object.name = 'hopper'
      object.nickname = 'hopperhuang'
      assert.equal(name, 'hopperhuang')
    })
  })
  describe('unlisten event', function () {
    it('should change nothing for event has benn unlistend', () => {
      const object = proxy({})
      let name = ''
      object.$listen('event', (o) => {
        name = o.name
      })
      object.$unlisten('event')
      object.name = 'hopperhuang'
      assert.equal(name, '')
    })
    it('should change nothing for event has been unlistend', () => {
      const array = proxy([])
      let name = ''
      array.$listen('event', (element) => {
        name = element[0].name
      })
      array[0] = {name: 'hopperhuang'}
      array.$unlisten('event')
      array[0] = {name: 'hopper'}
      assert.equal(name, 'hopperhuang')
    })
  })
  describe('define methods in object in advanced', () => {
    it('change proxied value', () => {
      const store = proxy({
        name: 'hopperhuang',
        changeName () {
          this.name = 'hopper'
        }
      })
      store.changeName()
      assert.equal(store.name, 'hopper')
    })
    it('call child\'s method', () => {
      const team = proxy({
        leader: {
          name: 'hopperhuang',
          changeName () {
            this.name = 'hopper'
          }
        }
      })
      team.leader.changeName()
      assert.equal(team.leader.name, 'hopper')
    })
    it('change proxied object\'s value although value has change ', () => {
      const store = proxy({
        person: {
          name: 'hopperhuang'
        },
        changeName () {
          this.person.name = 'hopper'
        }
      })
      store.person = {name: 'huang'}
      assert.equal(store.person.name, 'huang')
      store.changeName()
      assert.equal(store.person.name, 'hopper')
    })
  })
  describe('listeners spy on itself, but not objet\'s keys, when object is dropped, listens is dropped too ', () => {
    it('nothing will change, when then object\'s value changeed the second time ', () => {
      let number = 0
      const proxied = proxy({
        person: {
          name: 'hopperhuang'
        }
      })
      proxied.person.$listen('event', () => {
        number += 1
      })
      proxied.person.name = 'hopper'
      assert.equal(number, 1)
      proxied.person = {name: 'hopperhuang'}
      assert.equal(number, 1)
    })
    it('new value should add new listener by youself', () => {
      let number = 0
      const proxied = proxy({
        person: {
          name: 'hopperhuang'
        }
      })
      proxied.person.$listen('event', () => {
        number += 1
      })
      proxied.person.name = 'hopper'
      assert.equal(number, 1)
      proxied.person = {name: 'hopperhuang'}
      assert.equal(number, 1)
      proxied.person.$listen('event', () => {
        number *= 3
      })
      proxied.person.name = 'huang'
      assert.equal(number, 3)
    })
  })
})
