exports = module.exports = { // Declare your APIs document
  groups: [ // Declare group-key and group-description for apis in APIs document.
    {'place': 'Place APIs', 'meal': 'Meal APIs'}
  ],  
  declare: { //What do fields means
    address: { 
      "#": "Thong tin duong pho", // '#' Declare for title object address
      street: "Duong pho"         // 'field': Description 
    },
    user: {
      "#": "Thong tin user",
      "name": "<<float>>Ten user", // [array, object, string, integer, float] Add <<cuz_type>> to customize data type, default it will auto get typeof value 
      "age": "Tuoi user",
      "address": "${address}" // (Used when you declare for object) include address object which has just declared. Output is: "address": { "#": "Thong tin duong pho", street: "Duong pho" }
    },
    users: {
      "#": "List user",
      "${user}": undefined // (Used when you declare for array) inlucde object in key which is replaced. Output is : {"#": "List user"", "name": "<<float>>Ten user", "age": "Tuoi user", "address": { "#": "Thong tin duong pho", street: "Duong pho" }}
    },
    "req.header": { // Describe request header
      "content-type": "Loai header" 
    },
    "res.header": { // Describe response header
      
    }
  }
}