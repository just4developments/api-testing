module.exports = { // Declare API template you can change request body ... to reuse these apis
  des: "Declare user API", // API descriptions which is showed on test result
  disabled: true, // disable all apis in testcase. it wont execute. Only declare
  defaultInit: { // Declare global variable

  },
  apis: [{
    key: "user-ping", // Declare api key which will be extended by others
    des: "Ping user", // API descriptions which is showed on test result
    method: "head", // [get, post, put, delete, head] Request method
    url: "${host}/user", // Request url
    checker: [ // Your checkers, which you want vefiry response data. Default you can use: [equals, !equals, contains, !contains, status, size, in, !in] or you can add more your customize checker in _checker.js
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