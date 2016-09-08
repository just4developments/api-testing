var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var users = [
  {"name": "Bristan", "age": 28, "address": { "street": "LA, US"}},
  {"name": "Thanh", "age": 21, "address": { "street": "LY, HN"}}
];

app.get('/user', function (req, res) {
  res.send(users);
});

app.get('/user/:name', function (req, res) {
  var user = users.find(e=>{return e.name === req.params.name;});
  res.send(user);
});

app.post('/user', (req, res) => {
  users.push(req.body);
  res.send(req.body);
});

app.put('/user/:name', (req, res) => {
  var i = users.findIndex(e=>{return e.name === req.params.name;});
  req.body.name = users[i].name;
  users[i] = Object.assign(users[i], req.body);
  res.send(users[i]);
});

app.delete('/user/:name', (req, res) => {
  var i = users.findIndex(e=>{e.name === req.params.name});
  users.splice(i, 1);
  res.send(null);
});

app.head('/user', (req, res) => {
  users = [
    {"name": "Bristan", "age": 28, "address": { "street": "LA, US"}},
    {"name": "Thanh", "age": 21, "address": { "street": "LY, HN"}}
  ];
  res.send({ping: 'ok'});
});

app.listen(61189, function () {
  console.log('Example app listening on port 61189!');
});