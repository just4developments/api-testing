var async = require('async');
var Api = require('./api');
var Utils = require('../helper/utils');

module.exports = class Testcase {

  constructor(config, defaultConfig, defaultConfigApi = {}){
    this.config = Utils.assign(defaultConfig, config);
    this.config.default = Utils.assign(defaultConfigApi, this.config.default || {});
  }

  exec(cb){
    var tasks = [];
    for(var i in this.config.apis){
      tasks.push(((apiConfig, defaultConfigApi, cb) => {
        var api = new Api(apiConfig, defaultConfigApi);
        api.exec(cb);
      }).bind(null, this.config.apis[i], this.config.default));
    }
    async.series(tasks, (err, rs) => {
      for(var i in rs){
        this.config.apis[i] = rs[i];
      }
      cb(err, this.config);
    });
  }

}