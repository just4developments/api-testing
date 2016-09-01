module.exports = {
  name: "Test cuisine",
  default: {
    api: {
      header: {
        "content-type": "application/json"
      },
      parser: "json",
      checker: {
        status: 100
      }
    },
    testcase: {
      
    }
  },
  testcases: ['cuisine']
}