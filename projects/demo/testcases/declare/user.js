module.exports = {
  des: "Declare user API",
  disabled: true,
  defaultInit: {

  },
  apis: [{
    key: "user-ping",
    des: "Ping user",
    method: "head",
    url: "${host}/user",
    transformRequest: "json",
    checker: [
      {equals: {
        ping: 'ok'
      }}
    ]
  }, {
    key: "user-get",
    des: "Get users",
    method: "get",
    url: "${host}/user"
  }, {
    key: "user-add",
    des: "User add",
    method: "post",
    url: "${host}/user"
  }, {
    key: "user-update",
    des: "Update user information",
    method: "put",
    url: "${host}/user/:name",
  }, {
    key: "user-details",
    des: "Get user details",
    method: "GET",
    url: "${host}/user/:name"
  }, {
    key: "user-delete",
    des: "Delete user",
    method: "delete",
    url: "${host}/user/:name"
  }]
}