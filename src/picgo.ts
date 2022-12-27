import { PicGo } from "picgo"

let picgo

async function activate(configPath?: string) {
  picgo = new PicGo(configPath)
  console.log("picgo core v1.5.0 activated.")
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
    throw e
  }

  return ret
}

async function uploadFormClipboard() {
  console.log("PicGo is uploading form clipboard... ")
  const ret = await upload()
  console.log("upload success.")
  return ret
}

function deactivate() {
  picgo = null
  console.log("picgo deactivated.")
}

const picgoExtension = {
  activate,
  deactivate,
  upload,
  uploadFormClipboard,
}
export default picgoExtension
