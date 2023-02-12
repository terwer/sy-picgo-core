import { isSiyuanNewWin } from "~/src/utils/common"

const { ipcMain } = require("@electron/remote")

/**
 * 事件处理封装
 *
 * @param eventId 事件ID
 * @param eventCallback 事件回调
 */
const handleEvent = (eventId, eventCallback) => {
  ipcMain.on(eventId, (event, msg) => {
    if (!msg || msg?.type !== eventId) {
      console.warn("消息类型不匹配，忽略")
      return
    }

    const currentIsSiyuanNewWin = isSiyuanNewWin()
    if (msg.isSiyuanNewWin !== currentIsSiyuanNewWin) {
      console.log("msg.isSiyuanNewWin=>", msg.isSiyuanNewWin)
      console.log("currentIsSiyuanNewWin=>", currentIsSiyuanNewWin)
      console.warn("消息来源不一致，忽略")
      return
    }

    console.log("接收到事件" + eventId + "，msg=>", msg)
    eventCallback(msg)
  })
}

const handleImportLocalPlugin = () => {
  handleEvent("importLocalPlugin", function (msg) {
    console.log("这里是实际处理业务的=>", JSON.stringify(msg))
  })

  //   // const settingWindow = windowManager.get(IWindowList.SETTING_WINDOW)!
  //   // const res = await dialog.showOpenDialog(settingWindow, {
  //   //   properties: ['openDirectory']
  //   // })
  //   // const filePaths = res.filePaths
  //   // if (filePaths.length > 0) {
  //   //   const res = await picgo.pluginHandler.install(filePaths)
  //   //   if (res.success) {
  //   //     try {
  //   //       const list = simpleClone(getPluginList())
  //   //       event.sender.send('pluginList', list)
  //   //     } catch (e: any) {
  //   //       event.sender.send('pluginList', [])
  //   //       showNotification({
  //   //         title: T('TIPS_GET_PLUGIN_LIST_FAILED'),
  //   //         body: e.message
  //   //       })
  //   //     }
  //   //     showNotification({
  //   //       title: T('PLUGIN_IMPORT_SUCCEED'),
  //   //       body: ''
  //   //     })
  //   //   } else {
  //   //     showNotification({
  //   //       title: T('PLUGIN_IMPORT_FAILED'),
  //   //       body: res.body as string
  //   //     })
  //   //   }
  //   // }
  //
  //   // event.sender.send('hideLoading')
}

/**
 * 处理PicGO相关事件
 */
export default {
  listen() {
    handleImportLocalPlugin()
  },
}
