module.exports = {
  des: "All api for cuisine", // Testcase descriptions
  declareVar: {
    // host: 'abc.com' //overide var in main
  },
  defaultInit: {
    checker: [{
      status: 200
    }]
  },
  apis: [{
    extends: "user-get", // Key in ./delcare/user.js
    checker: [{ // Overide your checker
      size: 2 // Check response data which's length must equals 2
    }, {
      equals: [{ // Response data must equals ...
        "name": "Bristan",
        "age": 28,
        "address": {
          "street": "LA, US"
        }
      }, {
        "name": "Thanh",
        "age": 21,
        "address": {
          "street": "LY, HN"
        }
      }]
    }]
  }, {
    extends: "user-add",
    requestBody: {
      "name": "Nana",
      "age": 5,
      "address": {
        "street": "HBT, HN"
      }
    },
    var: "newUser", // assign response data into newUser variable. You can use in others by ${newUser}. It's value is {header: ResponseHeaderData, body: ResponseBody} 
    checker: [{
      equals: {
        "name": "Nana",
        "age": 5,
        "address": {
          "street": "HBT, HN"
        }
      }
    }]
  }, {
    extends: "user-update",
    url: "${host}/user/${newUser.body.name}",
    requestBody: {
      "age": 10,
      "address": {
        "street": "HCM"
      }
    },
    checker: [{
      equals: {
        "age": 10,
        "address": {
          "street": "HCM"
        }
      }
    }]
  }, {
    extends: "user-details",
    url: "${host}/user/${newUser.body.name}",
    checker: [{
      equals: {
        "name": "Nana",
        "age": 10,
        "address": {
          "street": "HCM"
        }
      }
    }]
  }, {
    extends: "user-delete",
    url: "${host}/user/${newUser.body.name}"
  }, {
    extends: "user-details",
    url: "${host}/user/${newUser.body.name}"
  }, {
    extends: "user-ping",
    des: "clear and reinit data"
  }]
}