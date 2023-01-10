import { PicGo } from "picgo"

let picgo

async function activate(configPath?: string) {
  picgo = new PicGo(configPath)
  console.log("picgo core v1.5.0 activated.custom configPath", configPath)
}

async function upload(input?: any[]) {
  let ret
  console.log("PicGo is uploading...")
  try {
    const result = await picgo.upload(input)
    if (result instanceof Array) {
      ret = result
      console.log("upload success.total=>" + result.length)
    }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }

  console.log("ret=>", ret)
  return JSON.stringify(ret)
}

async function uploadFormClipboard() {
  let ret
  console.log("PicGo is uploading form clipboard... ")
  try {
    ret = await upload()
    console.log("upload success.")
    console.log("ret=>", ret)
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
  return ret
}

function deactivate() {
  picgo = null
  console.log("picgo deactivated.")
}

function getPicgoObj() {
  console.log("get current picgo object.")
  return picgo
}

const picgoExtension = {
  activate,
  deactivate,
  upload,
  uploadFormClipboard,
  getPicgoObj,
}
export default picgoExtension
