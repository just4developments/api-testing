global.var = {};
var async = require('async');
var TestCase = require('./testcase');
var Utils = require('../helper/utils');

module.exports = class Main {

  constructor(pathProject) {
    this.config = require(`../${pathProject}/_main`);
    this.config.path = pathProject;
    if(this.config.var) global.var = this.config.var;
    for (var i in this.config.testcases) {
      this.config.testcases[i] = require(`../${pathProject}/${this.config.testcases[i]}.testcase`);
    }
  }

  exec(cb) {
    var tasks = [];
    for (var i in this.config.testcases) {
      tasks.push(((config, defaultTestcaseConfig, defaultApiConfig, cb) => {
        var tc = new TestCase(config, defaultTestcaseConfig, defaultApiConfig);
        tc.exec(cb);
      }).bind(null, this.config.testcases[i], this.config.default.testcase, this.config.default.api));
    }
    async.series(tasks, (err, rs) => {
      if (err) console.error(err);
      for (var i in rs) {
        this.config.testcases[i] = rs[i];
      }
      cb(this.config);
    });
  }

  getDoc(cb) {
    this.config.version = require(`../${this.config.path}/_version`);
    const Doc = require('./doc');
    var doc = new Doc(this.config);
    doc.getDoc(cb);
  }
}