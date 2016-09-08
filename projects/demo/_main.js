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
      transformRequest: "json", // form or json
      checker: [
        {status: [200]}
      ]
    },
    testcase: {
      
    }
  },
  testcases: ['declare/user','user']
}