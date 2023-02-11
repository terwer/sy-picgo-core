// noinspection TypeScriptUnresolvedVariable

import { PicGo } from "../../Electron-PicGo-Core/dist/index.esm.js"
import { IPicGo } from "../../Electron-PicGo-Core/dist/index"
import pkg from "../package.json"
import path from "path"
import * as fs from "fs"
import dayjs from "dayjs"

/*
 * 思源笔记内部PicGO对象定义
 */
class SyPicgo {
  private picgo

  constructor(configPath: string) {
    this.picgo = new PicGo(configPath)

    // 文件自动重命名
    this.picgo.helper.beforeUploadPlugins.register("renameFn", {
      handle: async (ctx: IPicGo) => {
        const autoRename = this.picgo.getConfig("settings.autoRename")
        if (autoRename) {
          await Promise.all(
            ctx.output.map(async (item, index) => {
              let fileName: string | undefined
              fileName =
                dayjs().add(index, "ms").format("YYYYMMDDHHmmSSS") +
                item.extname
              item.fileName = fileName
              console.log("即将自动重命名图片，新名称=>", fileName)
            })
          )
        }
      },
    })

    console.log("picgo core inited.configPath", configPath)
  }

  /**
   * 初始化
   */
  activate() {
    this.picgo.saveConfig({
      debug: true,
      PICGO_ENV: "SY-PICGO",
    })
    this.picgo.GUI_VERSION = pkg.version
    console.log("picgo core v1.5.0 activated.")
  }

  /**
   * 上传图片
   * @param input 图片数组
   */
  public async upload(input?: any[]) {
    let ret
    console.log("PicGo is uploading...")
    try {
      const result = await this.picgo.upload(input)
      if (result instanceof Array) {
        ret = result
        console.log("upload success.total=>" + result.length)
      }
    } catch (e) {
      console.error("upload error", e)
      throw new Error(
        "upload error, please check you picgo config!Detail info:" +
          JSON.stringify(e)
      )
    }

    console.log("ret=>", ret)
    return JSON.stringify(ret)
  }

  /**
   * 从剪贴板上传图片
   */
  public async uploadFormClipboard() {
    let ret
    console.log("PicGo is uploading form clipboard... ")
    try {
      ret = await this.picgo.upload()
      console.log("upload success.")
      console.log("ret=>", ret)
    } catch (e) {
      console.error("upload error", e)
      throw new Error(
        "upload error, please check you picgo config!Detail info:" +
          JSON.stringify(e)
      )
    }
    return ret
  }

  /**
   * 销毁PicGO对象
   */
  deactivate() {
    this.picgo = null
    console.log("picgo deactivated.")
  }

  /**
   * 获取PicGO对象
   */
  public getPicgoObj() {
    // console.log("get current picgo object.")
    return this.picgo
  }
}

const picgoExtension = {
  getCrossPlatformAppDataFolder: () => {
    let configFilePath
    if (process.platform === "darwin") {
      configFilePath = path.join(
        process.env.HOME,
        "/Library/Application Support"
      )
    } else if (process.platform === "win32") {
      // Roaming包含在APPDATA中了
      configFilePath = process.env.APPDATA
    } else if (process.platform === "linux") {
      configFilePath = process.env.HOME
    }

    return configFilePath
  },
  ensurePath: (folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder)
    }
  },
  upgradeCfg: (oldCfg, newCfgFolder, newCfgName) => {
    const picgo_cfg_067 = oldCfg
    const picgo_cfg_folder_070 = newCfgFolder

    picgoExtension.ensurePath(picgo_cfg_folder_070)

    const picgo_cfg_070 = path.join(picgo_cfg_folder_070, newCfgName)
    if (fs.existsSync(picgo_cfg_067) && !fs.existsSync(picgo_cfg_070)) {
      console.warn("检测到旧的PicGO配置文件，启动迁移")
      fs.copyFileSync(picgo_cfg_067, picgo_cfg_070)
    }
  },
  joinPath: (appFolder, filename) => {
    return path.join(appFolder, filename)
  },
  initPicgo: (configPath) => {
    const syPicgo = new SyPicgo(configPath)
    syPicgo.activate()
    return syPicgo
  },
}

export default picgoExtension
