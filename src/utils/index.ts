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

/**
 * @description 过滤对象中值为 undefined 与 空字符串 的属性
 * @param data
 * @param filter
 * @returns
 */
export const filterUndefinedValue = <T extends Record<any, any>>(
  data: T,
  filter: (value: any) => boolean = (value) => {
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
    if (!filter(value)) {
      return
    }

    trulyObject[k] = value
  })
  return trulyObject
}

/**
 *
 * @param data 变更后的数据
 * @param histories 历史(对比)数据
 * @returns
 */
export const getChangedData = <T extends Record<any, any>, K extends Record<any, any>>(
  data: T,
  histories: K,
  isSkip: (newValue: any, oldValue: any) => boolean = (newValue, oldValue) => {
    if (
      (newValue === '' || newValue === null || newValue === undefined) &&
      (oldValue === undefined || oldValue === null)
    ) {
      return true
    }

    return false
  }
) => {
  const changedData = {} as T

  const keys: (keyof K)[] = Object.keys(data)
  keys.forEach((k) => {
    const newValue = data[k] as any
    const oldValue = histories[k] as any
    if (isSkip(newValue, oldValue)) {
      return
    }

    if (newValue !== oldValue) {
      changedData[k] = newValue
    }
  })

  return changedData
}

export const getFileBase64 = (file: Blob, callback: (base64Url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(file)
}

/**
 * @description 深度查找树形结构中的某个节点
 * @param data 树形结构数据
 * @param compare 查找条件函数，返回 true 时表示找到
 * @param childrenKey 子节点的 key，默认 'children'
 * @returns
 */
export const deepFindItem = <T extends Record<string, any>>(
  data: T[],
  compare: (value: T) => boolean,
  childrenKey = 'children'
): T | undefined => {
  const queue: T[] = [...data]

  while (queue.length > 0) {
    const item = queue.shift()!

    if (compare(item)) {
      return item
    }

    if (item[childrenKey]?.length) {
      queue.push(...item[childrenKey])
    }
  }

  return undefined
}

/**
 * @description 深度遍历树形结构
 * @param data 树形结构数据
 * @param callback 回调函数，接收当前节点
 * @param childrenKey 子节点的 key，默认 'children'
 * @returns 返回新的树形结构数据
 */
export const deepMap = <T extends Record<any, any>>(
  data: T[],
  callback: (value: T) => T,
  childrenKey = 'children'
): T[] => {
  const result: T[] = []
  const queue: { node: T; parent: T | null; index: number }[] = data.map((node, index) => ({
    node,
    parent: null,
    index
  }))

  while (queue.length > 0) {
    const { node, parent, index } = queue.shift()!
    const newNode = callback({ ...node })

    if (parent === null) {
      result[index] = newNode
    } else {
      parent[childrenKey][index] = newNode
    }

    if (Array.isArray(newNode[childrenKey]) && newNode[childrenKey].length > 0) {
      queue.push(
        ...newNode[childrenKey].map((child: T, idx: number) => ({
          node: child,
          parent: newNode,
          index: idx
        }))
      )
    }
  }

  return result
}

/**
 * @description 树结构的广度优先遍历
 * @param data 树形结构数据
 * @param callback 回调函数，接收当前节点
 * @param childrenKey 子节点的 key，默认 'children'
 */
export const deepForeach = <T extends Record<string, any>>(
  data: T[],
  callback: (value: T) => void,
  childrenKey = 'children'
) => {
  if (!data?.length) return

  const queue: T[] = [...data]
  while (queue.length > 0) {
    const node = queue.shift()!
    callback(node)

    if (Array.isArray(node[childrenKey]) && node[childrenKey].length > 0) {
      queue.push(...node[childrenKey])
    }
  }
}
