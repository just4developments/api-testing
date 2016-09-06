exports = module.exports = {
  groups: [
    {'place': 'Document for place', 'group 1': 'Group 1'}
  ],  
  describe: {
    address: {
      "#": "Thong tin duong pho",
      street: "Duong pho"  
    },
    user: {
      "#": "Thong tin user",
      "name": "<<float>>Ten user",
      "age": "Tuoi user",
      "address": "${address}"
    },
    users: {
      "#": "List user",
      "${user}": undefined
    },
    "req.header": {
      "content-type": "Loai header"
    },
    "res.header": {
      
    }
  }
}