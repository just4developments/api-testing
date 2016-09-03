module.exports = {
  des: "All api for cuisine",
  var: {
    // host: 'abc.com' //overide var in main
  },
  default: {
    checker: {
      status: 200
    }
  },
  apis: [{
    name: "Upload file",
    des: "Test upload file",
    url: "POST http://173.164.244.85:4000/whatseat/account/upload",
    transform: "form", // form || json
    header: {
      "content-type": "multipart/form-data"
    },
    body: {
      name: 'file test',
      "file:avatar": 'C:\\Users\\thanh_xps13\\Desktop\\vephat.jpg'
    },
    //var: "",
    // doc: {"#body": "users", header: "req.header", "#header": "res.header", group: "place", "order": 2},
    // checker: {
    status: [200]
      //size: 20,
      //contains: undefined,
      // equals: {
      //   name: "nana",
      //   age: 1
      // }
      //in: undefined,
      //"!in": undefined,
      //"!equals": undefined,
      //"!contains": []
      // }
      //sleep: 0
      // disabled: true
  }, {
    name: "get test",
    des: "get test des",
    url: "GET ${host}/user",
    //var: "",
    doc: {
      "#body": "users",
      header: "req.header",
      "#header": "res.header",
      group: "place",
      "order": 2
    },
    // checker: {
    //status: [200],
    //size: 20,
    //contains: undefined,
    // equals: {
    //   name: "nana",
    //   age: 1
    // }
    //in: undefined,
    //"!in": undefined,
    //"!equals": undefined,
    //"!contains": []
    // }
    //sleep: 0
    // disabled: true
  }, {
    name: "test",
    des: "test",
    url: "POST ${host}/user/thanh",
    body: {
      name: "${host}",
      age: 1
    },
    //var: "",
    doc: {
      body: "user",
      "#body": "user",
      header: "req.header",
      "#header": "res.header",
      group: "place",
      "order": 2
    },
    checker: {
      //status: [200],
      //size: 20,
      //contains: undefined,
      equals: {
        name: "nana",
        age: 1
      }
      //in: undefined,
      //"!in": undefined,
      //"!equals": undefined,
      //"!contains": []
    },
    //sleep: 0
    // disabled: true
  }]
}