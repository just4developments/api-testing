module.exports = {
  des: "Declare user API",
  disabled: true,
  defaultInit: {
    
  },
  apis: [{
    key: "user-upload",
    des: "Upload user avatar",
    method: "POST",
    url: "${host}/whatseat/account/upload",
    requestHeader: {
      "content-type": "multipart/form-data"
    },
    checker: [{
      size: 1
    }]
  }, {
    key: "user-signup",
    des: "Sign-up user",
    method: "POST",
    url: "${host}/whatseat/signup",
    requestHeader: {
      app: "${shopKeeperAppId}"
    },
    requestBody: {
      device: {
        model: "Galaxy S7",
        platform: "Android",
        build_code: "Lolipop",
        build_number: "Lolipop",
        brand: "SamSung",
        device_id: ""
      }
    }
  }, {
    key: "user-login",
    des: "User login",
    method: "POST",
    url: "${host}/whatseat/login",
    requestHeader: {
      app: "${shopKeeperAppId}"
    }
  }, {
    key: "user-update",
    des: "Update user information",
    method: "PUT",
    url: "${host}/whatseat/me",
    requestBody: {
      device: {
        model: "Galaxy S7 - updated",
        platform: "Android - updated",
        build_code: "Lolipop - updated",
        build_number: "Lolipop - updated",
        brand: "SamSung - updated",
        device_id: ""
      }
    }
  }, {
    key: "user-details",
    des: "Get user details",
    method: "GET",
    url: "${host}/whatseat/me"
  }]
}
