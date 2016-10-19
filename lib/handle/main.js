global.var = {
  utils: require('./utils')
};
var async = require('async');
var TestCase = require('./testcase');
var utils = require('../helper/utils');
var Api = require('./api');
var fs = require('fs');
var path = require('path');
global.checker = require('./checker');

// Declare Type to remove field in _apply in checker
global.Remove = class Remove extends Object {}
  // Declare Data Type to validate data in checker
global.Any = class Any extends Object {}
global.Length = function Length(from, to) {
  if (to === undefined) {
    Length.value = from;
    Length.more = `(${from})`;
  } else {
    Length.value = [from, to];
    Length.more = `(${from === Any ? 'Any' : from}, ${to === Any ? 'Any' : to})`;
  }
  return Length;
};
global.Dateable = class Dateable extends Date {}
global.Stringable = class Stringable extends String {}
global.Arrayable = class Arrayable extends Array {}
global.Numberable = class Numberable extends Number {}
global.Booleanable = class Booleanable extends Boolean {}
global.Objectable = class Objectable extends Object {}
global.RegExpable = class RegExpable extends RegExp {}

module.exports = class Main {

  constructor(pathProject) {
    this.apis = [];
    this.config = require(`../${pathProject}/_main`);
    this.config.path = pathProject;

    if (this.config.declareVar)
      global.var = this.config.declareVar;
    global.var.utils = utils.assign(global.var.utils, require(`../${pathProject}/_utils`));
    global.checker = utils.assign(global.checker, require(`../${pathProject}/_checker`));

    if ('*' === this.config.apiTemplates) {
      this.config.apiTemplates = [];
      var files = fs.readdirSync(path.join(__dirname, `../${pathProject}/testcases/templates`)).sort();
      for (var name of files) {
        if (name.endsWith('.temp.js'))
          this.config.apiTemplates.push(name.replace('.temp.js', ''));
      }
    }
    for (let i in this.config.apiTemplates) {
      new TestCase(require(`../${pathProject}/testcases/templates/${this.config.apiTemplates[i]}.temp`), this.config.defaultInit.testcase, this.config.defaultInit.api);
    }

    if (!this.config.testcases || this.config.testcases.length <= 0)
      throw 'Could not found any testcases';

    if ('*' === this.config.testcases) {
      this.config.testcases = [];
      var files = fs.readdirSync(path.join(__dirname, `../${pathProject}/testcases`)).sort();
      for (var name of files) {
        if (name.endsWith('.case.js'))
          this.config.testcases.push(name.replace('.case.js', ''));
      }
    }
    for (let i in this.config.testcases) {
      this.config.testcases[i] = require(`../${pathProject}/testcases/${this.config.testcases[i]}.case`);
    }

    this.tasks = [];
    var i = 0;
    while (i < this.config.testcases.length) {
      var tc = new TestCase(this.config.testcases[i], this.config.defaultInit.testcase, this.config.defaultInit.api);

      if (tc.config.disabled) {
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

  getTest(cb) {
    cb({
      mode: global.mode,
      testcases: this.config.testcases,
      path: this.config.path,
      projectName: this.config.projectName,
      team: this.config.team
    });
  }

  getDoc(cb) {
    const Doc = require('./doc');
    var doc = new Doc(this.config);
    doc.getDoc(cb);
  }
}