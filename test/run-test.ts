async function main() {
  try {
    console.log("This is test")
  } catch (err) {
    console.log(err)
    console.error("Failed to run tests")
    process.exit(1)
  }
}

main()

export default {}
