module.exports = {
  name: "Test cuisine",
  browser: "chrome", // chrome, firefox, undefined is default browser
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
  testcases: ['user']
}