module.exports = {
  name: "Test cuisine",
  team: "VN Team",
  browser: "chrome", // chrome, firefox, undefined is default browser
  var: {
    host: 'http://localhost:61189'
  },
  default: {
    api: {
      nostop:  true,
      "cuz#header": [],
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