exports = module.exports = {
  groups: [
    {'cuisine': 'Document for cuisine APIs'}
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