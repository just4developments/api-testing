module.exports = {
  projectName: "Project name",
  team: "Your team name",
  browser: "chrome", //[chrome, firefox, undefined]: Target browser to open after finish test, debug, or gen document
  declareVar: {
    host: 'http://localhost:61189' // Declare global variable which you re-use in all testcase, api 
  },
  defaultInit: { // Declare default value for testcase, or api. But you can override all of them in each testcase or api
    api: { 
      skipError:  true, // Skip error to keep finishing all apis in testcases
      allowResponseHeader: ['content-type', 'access_token'], // Customize response header which discribe in doc and test result
      requestHeader: { // Set default request header, you dont need declare it for each api
        "content-type": "application/json"
      },
      checker: [ // Declare default checker for all apis
        {status: [200]} // Check response status in array. In example is 200 is passed
      ]
    },
    testcase: {
      
    }
  },
  apiTemplates: '*', // Declare api template which will be used to extends in api. ['user'] locate to templates/
  testcases: ['user'] // Declare testcases which is used to test APIs in them 
}