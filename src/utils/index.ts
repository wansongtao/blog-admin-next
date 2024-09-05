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
