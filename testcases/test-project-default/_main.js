module.exports = {
  name: "Test cuisine",
  var: {
    host: 'http://localhost:61188'
  },
  default: {
    api: {
      header: {
        "content-type": "application/json"
      },
      transform: "json",
      checker: {
        status: 100
      }
    },
    testcase: {
      
    }
  },
  testcases: ['cuisine']
}