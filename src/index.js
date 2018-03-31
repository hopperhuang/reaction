const a = new Proxy([], {
  get (target, property) {
    console.log('proxied a')
    // console.log(target)
    // console.log(property)
    return Reflect.get(target, property)
  },
  set (target, property, value) {
    console.log('set a')
    console.log(`${property} has change`)
    return Reflect.set(target, property, value)
  }
})
// const b = new Proxy({a: a}, {
//   get (target, property) {
//     console.log('proxied b')
//     return Reflect.get(target, property)
//   },
//   set (target, property, value) {
//     console.log('set b')
//     return Reflect.set(target, property, value)
//   }
// })

a.push(1)
