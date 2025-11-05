export default {
  spec_dir: ".",
  spec_files: [
    "test/**/*.spec.?(m)js"
  ],
  helpers: [
    "spec/support/**/*.?(m)js"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true
  }
}
