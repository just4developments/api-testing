module.exports = {
  projectName: "Test cuisine",
  team: "VN Team",
  browser: "chrome", // chrome, firefox, undefined is default browser
  declareVar: {
    host: 'http://localhost:4000',
    pathUpload: "C:\\Users\\thanh_xps13\\Desktop",
    shopKeeperAppId: "8765d4e06c66a6990673331b54450de3"
  },
  defaultInit: {
    api: {
      skipError:  true,
      allowResponseHeader: ['appid', 'access_token'],
      requestHeader: {
        "content-type": "application/json"
      },
      transformRequest: "json", // form or json
      checker: [
        {status: 200}
      ]
    },
    testcase: {
      
    }
  },
  testcases: ['declare/user', 'user']
}