export default function proxy (target) {
  // 对target做一个判断,只有对象和数组才可以proxy
  const targetType = typeof target
  // must be a object or an array, but not a function, target should not be null
  if (targetType === 'object' && target) {
    // make target to be proxied
    const isArray = Array.isArray(target)
    const copyTarget = isArray ? [...target] : {...target}
    // make copyTarget reactive
    // set listens to collect reaction
    copyTarget.$lisntenrs = {}
    // listen to reactions
    copyTarget.$listen = (event, reaction) => {
      proxied.$lisntenrs[event] = reaction
    }
    copyTarget.$emit = () => {
      const keys = Object.keys(proxied.$lisntenrs)
      keys.forEach((key) => {
        proxied.$lisntenrs[key] && proxied.$lisntenrs[key](proxied)
      })
    }
    copyTarget.$unlisten = (event) => {
      delete proxied.$lisntenrs[event]
    }
    const proxied = beProxied(copyTarget)
    // make it's children to be proxied
    const keys = Object.keys(copyTarget)
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index]
      const value = copyTarget[key]
      const valueType = typeof value
      if (valueType === 'object' && value) {
        proxied[key] = value
      }
    }
    // marked as proxied
    proxied.$proxied = true
    return proxied
  } else {
    throw new Error('proxied target must be a object but not null or an array')
  }
}

export function beProxied (target) {
  return new Proxy(target, {
    get (target, property) {
      return Reflect.get(target, property)
    },
    set (target, property, value) {
      // make target and is child to be proxied
      const valueType = typeof value
      // just proxy object and array
      if (valueType === 'object' && value) {
        // just set listeners as default
        if (property === '$lisntenrs') {
          Reflect.set(target, property, value)
          // set other properties to be proxied
        } else {
          const proxied = proxy(value)
          Reflect.set(target, property, proxied)
        }
      } else {
        Reflect.set(target, property, value)
      }
      // call the listener
      target.$emit()
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
