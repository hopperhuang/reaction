export default function proxy (target) {
  // 对target做一个判断,只有对象和数组才可以proxy
  console.log('proxy!! 22333')
}

export function beProxied (target) {
  return new Proxy(target, {
    get (target, property) {
      return Reflect.get(target, property)
    },
    set (target, property, value) {
      // 需要增加listener的调用
      Reflect.set(target, property, value)
      return true
    },
    has (target, property) {
      return Reflect.has(target, property)
    },
    deleteProperty (target, property) {
      return Reflect.deleteProperty(target, property)
    },
    defineProperty (target, key, descriptor) {
      throw new Error('define property is forbidden')
    },
    getOwnPropertyDescriptor (target, property) {
      return Reflect.getOwnPropertyDescriptor(target, property)
    },
    setPrototypeOf (target, proto) {
      throw new Error('Changing the prototype is forbidden')
    },
    isExtensible (target) {
      return Reflect.isExtensible(target)
    },
    ownKeys (target) {
      return Reflect.ownKeys(target)
    },
    preventExtensions (target) {
      return Reflect.preventExtensions(target)
    }
  })
}
