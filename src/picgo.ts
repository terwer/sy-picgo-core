import { PicGo } from "picgo";

async function activate(context) {
  console.log("picgo core v1.5.0 activated.")
}

async function upload(input?: any[]) {
  let ret
  console.log("PicGo is uploading...")
  const picgo = new PicGo()
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
  console.log("picgo deactivated.")
}

const picgoExtension = {
  activate,
  deactivate,
  upload,
  uploadFormClipboard,
}
export default picgoExtension
