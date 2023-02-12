import { isReactive, isRef, toRaw, unref } from "vue"
import { PicGo } from "../../../Electron-PicGo-Core/dist/index.esm.js"

/**
 * 是否是Electron环境，等价于isInSiyuanOrSiyuanNewWin
 */
const isElectron = /Electron/.test(navigator.userAgent)

/**
 * 思源笔记或者思源笔记新窗口，等价于Electron环境
 */
const isInSiyuanOrSiyuanNewWin = () => {
  return isElectron
}

/**
 * 思源笔记Iframe挂件环境
 */
const isSiyuanWidget = () => {
  return (
    window.frameElement != null &&
    window.frameElement.parentElement != null &&
    window.frameElement.parentElement.parentElement != null &&
    window.frameElement.parentElement.parentElement.getAttribute(
      "data-node-id"
    ) !== ""
  )
}

/**
 * 思源笔记新窗口
 */
export const isSiyuanNewWin = () => {
  // @ts-ignore
  return typeof window.terwer !== "undefined"
}

/**
 * 获取可操作的Window
 */
export const getSiyuanWindow = () => {
  if (isSiyuanWidget()) {
    return parent.window
  } else {
    if (isSiyuanNewWin()) {
      return window
    }
    return window
  }
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
  if (typeof args === "object") {
    const data = {}
    Object.keys(args).forEach((key) => {
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

/**
 * 获取Picgo对象
 */
export const getPicgoFromWindow = (): PicGo => {
  const syWin = getSiyuanWindow()
  // @ts-ignore
  const syPicgo = syWin?.SyPicgo
  return syPicgo?.getPicgoObj()
}
