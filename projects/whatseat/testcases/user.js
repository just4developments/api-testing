module.exports = {
  des: "Testcase for User",
  declareVar: {
    // host: 'abc.com' //overide var in main
    username01: "${utils.username}"
  },
  defaultInit: {
    checker: [{
      status: 200
    }]
  },
  apis: [{
    extends: "user-upload",
    requestBody: {
      "file:avatar": "${pathUpload}/vephat.jpg"
    },
    var: "userAvatar"
  }, {
    extends: "user-signup",
    requestBody: {
      "username": "${username01}",
      "email": "${username01}@gmail.com",
      "password": "aA1234",
      "infor": {
        "fullname": "Test ${username01}",
        "gender": 1,
        "phone": "0944123123",
        "address": "xx xxx xxx",
        "city": "xxxx",
        "region": "xxx",
        "country": "xx",
        "location": {
          "lat": 123.321123,
          "lng": 32.3123432
        },
        "avatar": "${userAvatar.body[0]}"
      }
    },
    var: "userDetails",
    nextCallAfter: 1000
  }, {
    extends: "user-login",
    des: "Login by username",
    requestBody: {
      "username": "${username01}",
      "password": "aA1234"
    },
    var: "userLogin"
  }, {
    extends: "user-login",
    des: "Login by email",
    requestBody: {
      "username": "${username01}@gmail.com",
      "password": "aA1234"
    }
  }, {
    extends: "user-update",
    des: "Update user information",
    requestHeader: {
      "access_token": "${userLogin.header.access_token}"
    },
    requestBody: {
      infor: {
        fullname: "Test register - updated",
        gender: 0,
        phone: "0944123123 - updated",
        address: "xx xxx xxx - updated",
        city: "xxxx - updated",
        region: "xxx - updated",
        country: "xx - updated",
        location: {
          lat: 123.321123,
          lng: 32.3123432
        },
        avatar: "${userDetails.body.infor.avatar}"
      },
    }
  }, {
    extends: "user-details",
    des: "Get user details",
    requestHeader: {
      "access_token": "${userLogin.header.access_token}"
    },
    checker: [{
      equals: "${userDetails.body}"
    }],
    doc: {title: "Get user details", responseBody: "user", requestHeader: "req.header", responseHeader: "res.header", groupName: "user", order: 2},
    var: "userDetails"
  }]
}