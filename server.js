var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/user', function (req, res) {
  res.send([
    {"name": "thanh", "age": 28, "address": { "street": "Luong yen"}},
    {"name": "test", "age": 21, "address": { "street": "Lo duc"}}
  ]);
});

app.post('/user/:name', (req, res) => {
  console.log(req.body);
  res.send(req.body);
})

app.listen(61188, function () {
  console.log('Example app listening on port 61188!');
});