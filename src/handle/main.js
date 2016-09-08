global.var = {};
var async = require('async');
var TestCase = require('./testcase');
var utils = require('../helper/utils');
var Api = require('./api');

module.exports = class Main {

  constructor(pathProject) {
    this.apis = [];
    this.config = require(`../${pathProject}/_main`);
    this.config.path = pathProject;
    
    if(this.config.declareVar) global.var = this.config.declareVar;
    global.var.utils = require(`../${pathProject}/_utils`);
    
    Api.checker = utils.assign(Api.checker, require(`../${pathProject}/_checker`));

    for (var i in this.config.testcases) {
      this.config.testcases[i] = require(`../${pathProject}/testcases/${this.config.testcases[i]}`);
    }
    
    this.tasks = [];
    var i = 0;
    while(i<this.config.testcases.length){
      var tc = new TestCase(this.config.testcases[i], this.config.defaultInit.testcase, this.config.defaultInit.api);
      
      if(tc.config.disabled){
        this.config.testcases.splice(i, 1);
        continue;
      }

      this.apis.push(tc.apis);
      this.tasks.push(((tc, cb) => {
        tc.exec(cb);                
      }).bind(null, tc));

      i++;
    }
  }

  exec(cb) {    
    async.series(this.tasks, (err, rs) => {
      if (err) console.error(err);
      for (var i in rs) {
        this.config.testcases[i] = rs[i];
      }
      cb(this.config);
    });
  }

  getTest(cb){
    cb({testcases: this.config.testcases, path: this.config.path, projectName: this.config.projectName, team: this.config.team});
  }

  getDoc(cb) {
    const Doc = require('./doc');
    var doc = new Doc(this.config);
    doc.getDoc(cb);
  }
}