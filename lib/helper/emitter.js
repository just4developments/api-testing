var express = require('express');
var app = express();
var bodyParser = require('body-parser')

module.exports = (main, fcDone) => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json());

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, HEAD, PUT');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.post('/re-run', function (req, res) {
    var tcIndex = +req.body.t;
    var aIndex = +req.body.a;
    var api = main.apis[tcIndex][aIndex];
    delete api.config.error;
    api.exec(()=>{
      res.send(api.config);
    });
  });

  app.listen(61188, function () {
    console.log('Event emitter is listening on port 61188!');
    fcDone();
  });
}