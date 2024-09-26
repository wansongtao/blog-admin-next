export const getDataType = (obj: unknown) => {
  let res = Object.prototype.toString.call(obj).split(' ')[1]
  res = res.substring(0, res.length - 1).toLowerCase()
  return res
}

/**
 * @description 节流函数，触发一次后，下次触发需要间隔一定的时间
 * @param fn 需要执行的函数
 * @param delay 间隔时间，默认1s，单位ms
 * @returns
 */
export const throttle = <T>(fn: (...args: T[]) => void, delay = 1000) => {
  let lastTime = 0
  return function (this: any, ...args: T[]) {
    const nowTime = Date.now()

    if (nowTime - lastTime < delay) {
      return
    }

    lastTime = nowTime
    fn.apply(this, args)
  }
}

/**
 * @description 防抖函数，一定时间内多次触发，只执行最后触发的一次(可能永远不会执行)
 * @param fn 需要防抖的函数
 * @param delay 间隔时间，默认200ms，单位ms
 * @param immediate 第一次是否立即执行，默认false
 * @returns
 */
export const debounce = <T = unknown>(
  fn: (...args: T[]) => void,
  delay = 200,
  immediate = false
) => {
  let timer: NodeJS.Timeout | null = null
  let isFirst = true

  return function (this: any, ...args: T[]) {
    timer && clearTimeout(timer)

    if (immediate && isFirst) {
      isFirst = false
      fn.apply(this, args)
      return
    }

    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * @description 将对象转换为数组。默认 key 作为 value，value 作为 label
 * @param data
 * @param transform 自定义转换函数，接收一个参数，为对象的 key
 * @returns
 */
export const objectToArray = <T extends Record<any, unknown>>(
  data: T,
  transform = (key: keyof T) => {
    return {
      label: data[key],
      value: key
    }
  }
) => {
  const keys: (keyof T)[] = Object.keys(data)

  return keys.map((k) => {
    return transform(k)
  })
}

export const getTrulyValue = <T extends Record<any, any>>(
  data: T,
  isTruly: (value: any) => boolean = (value) => {
    if (value === '' || value === undefined) {
      return false
    }

    return true
  }
) => {
  const trulyObject = {} as T

  const keys: (keyof T)[] = Object.keys(data)
  keys.forEach((k) => {
    const value = data[k] as any
    if (!isTruly(value)) {
      return
    }

    trulyObject[k] = value
  })
  return trulyObject
}
