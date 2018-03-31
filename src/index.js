const a = new Proxy({name: 'name'}, {
  get (target, property) {
    console.log('proxied a')
    return Reflect.get(target, property)
  },
  set (target, property, value) {
    console.log('set a')
    return Reflect.set(target, property, value)
  }
})
const b = new Proxy({a: a}, {
  get (target, property) {
    console.log('proxied b')
    return Reflect.get(target, property)
  },
  set (target, property, value) {
    console.log('set b')
    return Reflect.set(target, property, value)
  }
})

b.a.name = 'hopper'
// b.a = 1
