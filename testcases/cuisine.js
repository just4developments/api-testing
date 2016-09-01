module.exports = {
  des: "All api for cuisine",
  apis: [{
    name: "Get cuisine",
    url: "GET http://173.164.244.85:4000/whatseat/cuisine",
    headers: {},
    parser: "json",
    var: "cuisineList",
    checker: {
      status: 200,
      size: 2, 
      contains: undefined,
      equals: undefined,
      in: undefined,
      "!in": undefined,
      "!equals": undefined,
      "!contains": [{"id":"17edc0515-46c3-4581-b778-4f5343e64dcd","des":"","name":"Asian"}]
    }
  },{
    name: "Get cuisine",
    url: "GET http://173.164.244.85:4000/whatseat/cuisine/${cuisineList[0].id}",
    headers: {},
    parser: "json",
    var: "cuisineList1",
    checker: {
      status: 200,
      size: 2, 
      contains: undefined,
      equals: undefined,
      in: undefined,
      "!in": undefined,
      "!equals": undefined,
      "!contains": [{"id":"17edc0515-46c3-4581-b778-4f5343e64dcd","des":"","name":"Asian"}]
    }
  }]
}