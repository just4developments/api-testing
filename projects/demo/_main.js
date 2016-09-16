module.exports = {
  projectName: "Test cuisine",
  team: "VN Team",
  browser: "chrome", // chrome, firefox, undefined is default browser
  declareVar: {
    host: 'http://localhost:61189'
  },
  defaultInit: {
    api: {
      skipError:  true,
      allowResponseHeader: ['content-type'],
      requestHeader: {
        "content-type": "application/json"
      },
      checker: [
        {status: [200]}
      ]
    },
    testcase: {
      
    }
  },
  apiTemplates:['user'],
  testcases: ['user']
}