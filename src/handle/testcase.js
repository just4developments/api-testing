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
    var i = 0;
    while(i<this.config.apis.length){
      var api = new Api(this.config.apis[i], this.config.default);

      if(this.config.apis[i].disabled) {
        this.config.apis.splice(i, 1);
        continue;
      }
      
      this.apis.push(api);
      tasks.push(((api, cb) => {
        api.exec(cb);
      }).bind(null, api));

      i++;
    }
    async.series(tasks, (err, rs) => {
      for(var i in rs){
        this.config.apis[i] = rs[i];
      }
      cb(err, this.config);
    });
  }

}