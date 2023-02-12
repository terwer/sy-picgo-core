import { isReactive, isRef, toRaw, unref } from 'vue'

/**
 * 思源笔记新窗口
 */
export const isSiyuanNewWin = () => {
  // @ts-ignore
  return typeof window.terwer !== "undefined"
}

/**
 * get raw data from reactive or ref
 */
export const getRawData = (args: any): any => {
  if (Array.isArray(args)) {
    const data = args.map((item: any) => {
      if (isRef(item)) {
        return unref(item)
      }
      if (isReactive(item)) {
        return toRaw(item)
      }
      return getRawData(item)
    })
    return data
  }
  if (typeof args === 'object') {
    const data = {}
    Object.keys(args).forEach(key => {
      const item = args[key]
      if (isRef(item)) {
        data[key] = unref(item)
      } else if (isReactive(item)) {
        data[key] = toRaw(item)
      } else {
        data[key] = getRawData(item)
      }
    })
    return data
  }
  return args
}
