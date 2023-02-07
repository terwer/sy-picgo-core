import { PicGo } from "picgo"
import pkg from "../package.json"

/*
 * 思源笔记内部PicGO对象定义
 */
class SyPicgo {
  private picgo

  constructor(configPath: string) {
    this.picgo = new PicGo(configPath)
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
    console.log("get current picgo object.")
    return this.picgo
  }
}

const picgoExtension = {
  initPicgo: (configPath) => {
    const syPicgo = new SyPicgo(configPath)
    syPicgo.activate()
    window.SyPicgo = syPicgo
    console.log("挂载window.SyPicgo", window.SyPicgo)
  },
  destroyPicgo: () => {
    if (!window.SyPicgo) {
      return
    }
    window.SyPicgo.deactivate()
    console.log("销毁window.SyPicgo", window.SyPicgo)
  },
}

export default picgoExtension
