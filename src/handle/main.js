global.var = {};
var async = require('async');
var TestCase = require('./testcase');
var Utils = require('../helper/utils');

module.exports = class Main {

  constructor(pathProject) {
    this.config = require(`../${pathProject}/_main`);
    if ('doc' === global.action) this.doc = require(`../${pathProject}/_doc`);
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
    const defaultDoc = {
      group: 'anonymous',
      order: 1
    };
    var tmpDoc = {};
    for (var ts of this.config.testcases) {
      for (var api of ts.apis) {
        if (api.doc) {
          var apiDoc = {
            name: api.name,
            des: api.des,
            url: api.url,
            order: api.doc.order
          };
          api.doc = Utils.assign(defaultDoc, api.doc);
          if (!tmpDoc[api.doc.group]) tmpDoc[api.doc.group] = [];
          if ((api['#body'] instanceof Array) && api['#body'].length > 1) {
            api['#body'] = [api['#body'][0]];
          }
          if (api.doc.header) apiDoc.header = this.applyDocToObject(api.doc.header, api.header);
          if (api.doc.body) apiDoc.body = this.applyDocToObject(api.doc.body, api.body);
          if (api.doc["#header"]) apiDoc._header = this.applyDocToObject(api.doc["#header"], api["#header"]);
          if (api.doc["#body"]) apiDoc._body = this.applyDocToObject(api.doc["#body"], api['#body']);                    
          tmpDoc[api.doc.group].push(apiDoc);
        }
      }
    }
    var rs = [];
    for (var i in tmpDoc) {
      var title;
      tmpDoc[i].sort((a, b) => {
        return a.order - b.order;
      });
      tmpDoc[i].order = this.doc.groups.findIndex(e=>{ return Object.keys(e).indexOf(i) !== -1; });
      if(tmpDoc[i].order < 0) {
        console.warn(`Not declare group "${i}" in _doc.js`);
        tmpDoc[i].order = 100;
        title="Not set group title yet";
      }else{
        title = this.doc.groups[tmpDoc[i].order][i];
      }
      rs.push({title: title, apis: tmpDoc[i]});
    }
    rs.sort((a, b) => {
      return a.order - b.order;
    });
    cb(rs);
  }
  
  // Private
  applyDocToObject(doc, content){
    var docDeclare = {};
    for (var docname of doc.split('|')) {
      docDeclare = Utils.assign(docDeclare, eval(`this.doc["${docname}"]`));      
    }
    return this.setDocToObject(docDeclare, content);
  }
  setDocToObject(doc, data) {
    if (data instanceof Object) {
      for (var i in data)
        data[i] = this.setDocToObject(doc ? doc[i] : undefined, data[i]);
      return data;
    }
    return doc;
  }
}