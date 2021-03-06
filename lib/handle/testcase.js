var async = require('async');
var Api = require('./api');
var utils = require('../helper/utils');

module.exports = class Testcase {

  constructor(config, defaultConfig, defaultConfigApi = {}) {
    this.apis = [];
    this.config = utils.assign(defaultConfig, config);
    this.config.defaultInit = utils.assign(defaultConfigApi, this.config.defaultInit || {});

    this.tasks = [];
    var i = 0;
    while (i < this.config.apis.length) {
      var api = new Api(this.config.apis[i], utils.assign({
        disabled: this.config.disabled
      }, this.config.defaultInit));

      if (api.config.disabled) {
        this.config.apis.splice(i, 1);
        continue;
      }

      this.apis.push(api);
      this.tasks.push(((api, cb) => {
        api.exec(cb);
      }).bind(null, api));

      i++;
    }
  }

  exec(cb) {
    global.var = utils.assign(global.var, utils.applyValue(this.config.declareVar).value);
    async.series(this.tasks, (err, rs) => {
      this.config.apis = rs;
      cb(err, this.config);
    });
  }
}