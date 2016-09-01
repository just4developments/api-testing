module.exports = {
  des: "All api for cuisine",
  default: {
    checker: {
      status: 200
    }
  },
  apis: [{    
    name: "Get list cuisine",
    des: "",
    url: "GET http://173.164.244.85:4000/whatseat/cuisine",
    var: "cuisineList",
    doc: {_body: "cuisines", "#body": "cuisines", header: "req.header", "#header": "res.header", group: "place", "order": 2},
    checker: {
      status: 200,
      size: 20, 
      contains: undefined,
      equals: undefined,
      in: undefined,
      "!in": undefined,
      "!equals": undefined,
      "!contains": [{"id":"17edc0515-46c3-4581-b778-4f5343e64dcd","des":"","name":"Asian"}]
    },
    sleep: 2000
  },{
    name: "Get details cuisine",
    url: "GET http://173.164.244.85:4000/whatseat/cuisine/${cuisineList[0].id}",
    header: {},
    body: undefined,
    var: "cuisineList1",
    doc: {body: "cuisine", "#body": "cuisine", header: "req.header", "#header": "res.header", group: "cuisine", "order": 1},
    checker: {
      contains: undefined,
      equals: "${cuisineList[0]}",
      in: undefined,
      "!in": undefined,
      "!equals": undefined,
      "!contains": undefined
    }
  }]
}