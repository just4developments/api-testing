var async = require('async');
var Api = require('./api');
var Utils = require('../helper/utils');

module.exports = class Testcase {

  constructor(config, defaultConfig, defaultConfigApi = {}){
    this.apis = [];
    this.config = Utils.assign(defaultConfig, config);
    this.config.default = Utils.assign(defaultConfigApi, this.config.default || {});
    global.var = Utils.assign(global.var, this.config.var);
  }

  exec(cb){
    var tasks = [];
    for(var i =this.config.apis.length-1; i>=0; i--){
      if(this.config.apis[i].disabled) {
        this.config.apis.splice(i, 1);
        continue;
      }
      tasks.splice(0, 0, ((apiConfig, defaultConfigApi, cb) => {
        var api = new Api(apiConfig, defaultConfigApi);
        api.exec(cb);
        this.apis.push(api);
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