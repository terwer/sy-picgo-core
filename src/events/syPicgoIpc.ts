import {
  getPicgoFromWindow,
  handleStreamlinePluginName,
  isSiyuanNewWin,
  simpleClone,
} from "~/src/utils/common"
import { dialog, getCurrentWindow, ipcMain } from "@electron/remote"
import path from "path"
import { IPicGoHelperType } from "~/src/utils/enum"
import { IGuiMenuItem, PicGo as PicGoCore } from "electron-picgo"

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
      // console.log("msg.isSiyuanNewWin=>", msg.isSiyuanNewWin)
      // console.log("currentIsSiyuanNewWin=>", currentIsSiyuanNewWin)
      console.warn("消息来源不一致，忽略")
      return
    }

    console.log("接收到事件" + eventId + "，msg=>", msg)
    eventCallback(event, msg)
  })
}

// get uploader or transformer config
const getConfig = (name: string, type: IPicGoHelperType, ctx: PicGoCore) => {
  let config: any[] = []
  if (name === "") {
    return config
  } else {
    const handler = ctx.helper[type].get(name)
    if (handler) {
      if (handler.config) {
        config = handler.config(ctx)
      }
    }
    return config
  }
}

const handleConfigWithFunction = (config: any[]) => {
  for (const i in config) {
    if (typeof config[i].default === "function") {
      config[i].default = config[i].default()
    }
    if (typeof config[i].choices === "function") {
      config[i].choices = config[i].choices()
    }
  }
  return config
}

const getPluginList = (): IPicGoPlugin[] => {
  const picgo = getPicgoFromWindow()
  const STORE_PATH = picgo.baseDir

  const pluginList = picgo.pluginLoader.getFullList()
  const list = []
  for (const i in pluginList) {
    const plugin = picgo.pluginLoader.getPlugin(pluginList[i])!
    const pluginPath = path.join(STORE_PATH, `/node_modules/${pluginList[i]}`)
    const pluginPKG = require(path.join(pluginPath, "package.json"))
    const uploaderName = plugin.uploader || ""
    const transformerName = plugin.transformer || ""
    let menu: Omit<IGuiMenuItem, "handle">[] = []
    if (plugin.guiMenu) {
      menu = plugin.guiMenu(picgo).map((item) => ({
        label: item.label,
      }))
    }
    let gui = false
    if (pluginPKG.keywords && pluginPKG.keywords.length > 0) {
      if (pluginPKG.keywords.includes("picgo-gui-plugin")) {
        gui = true
      }
    }
    // @ts-ignore
    const obj: IPicGoPlugin = {
      name: handleStreamlinePluginName(pluginList[i]),
      fullName: pluginList[i],
      author: pluginPKG.author.name || pluginPKG.author,
      description: pluginPKG.description,
      logo:
        "file://" + path.join(pluginPath, "logo.png").split(path.sep).join("/"),
      version: pluginPKG.version,
      gui,
      config: {
        plugin: {
          fullName: pluginList[i],
          name: handleStreamlinePluginName(pluginList[i]),
          config: plugin.config
            ? handleConfigWithFunction(plugin.config(picgo))
            : [],
        },
        uploader: {
          name: uploaderName,
          config: handleConfigWithFunction(
            getConfig(uploaderName, IPicGoHelperType.uploader, picgo)
          ),
        },
        transformer: {
          name: transformerName,
          config: handleConfigWithFunction(
            getConfig(uploaderName, IPicGoHelperType.transformer, picgo)
          ),
        },
      },
      // @ts-ignore
      enabled: picgo.getConfig(`picgoPlugins.${pluginList[i]}`),
      homepage: pluginPKG.homepage ? pluginPKG.homepage : "",
      guiMenu: menu,
      ing: false,
    }
    list.push(obj)
  }
  return list
}

const handleImportLocalPlugin = () => {
  handleEvent("importLocalPlugin", async function (event, msg) {
    const res = await dialog.showOpenDialog(getCurrentWindow(), {
      properties: ["openDirectory"],
    })
    const filePaths = res.filePaths
    console.log("filePaths=>", filePaths)

    const list = simpleClone(getPluginList())
    console.log("pluginList=>", list)
    return

    const picgo = getPicgoFromWindow()
    console.log("picgo=>", picgo)
    if (filePaths.length > 0) {
      const res = await picgo.pluginHandler.install(filePaths)
      if (res.success) {
        try {
          const list = simpleClone(getPluginList())
          console.log("pluginList=>", list)
          // event.sender.send('pluginList', list)
        } catch (e: any) {
          // event.sender.send('pluginList', [])
          // showNotification({
          //   title: T('TIPS_GET_PLUGIN_LIST_FAILED'),
          //   body: e.message
          // })
        }
        // showNotification({
        //   title: T('PLUGIN_IMPORT_SUCCEED'),
        //   body: ''
        // })
      } else {
        // showNotification({
        //   title: T('PLUGIN_IMPORT_FAILED'),
        //   body: res.body as string
        // })
      }
    }

    // event.sender.send('hideLoading')
  })
}

/**
 * 处理PicGO相关事件
 */
export default {
  listen() {
    handleImportLocalPlugin()
  },
}
