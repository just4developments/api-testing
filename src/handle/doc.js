var Utils = require('../helper/utils');
var readline = require('readline')
var path = require('path');
var fs = require('fs');

module.exports = class Doc {
  
  constructor(config){
    this.config = config;
    this.doc = require(`../${this.config.path}/_doc`);
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
            method: api.method,
            order: api.doc.order
          };
          api.doc = Utils.assign(defaultDoc, api.doc);
          if (!tmpDoc[api.doc.group]) tmpDoc[api.doc.group] = [];
          if ((api['#body'] instanceof Array) && api['#body'].length > 1) {
            api['#body'] = [api['#body'][0]];
          }
          if (api.doc.header && api.header) apiDoc.header = {
            doc: this.getDocFromObject(this.evalDoc(api.doc.header), api.header),
            data: api.header
          }
          if (api.doc.body && api.body) apiDoc.body = {
            doc: this.getDocFromObject(this.evalDoc(api.doc.body), api.body),
            data: api.body
          }
          if (api.doc["#header"] && api["#header"]) apiDoc["#header"] = {
            doc: this.getDocFromObject(this.evalDoc(api.doc["#header"]), api["#header"]),
            data: api["#header"]
          }
          if (api.doc["#body"] && api["#body"]) apiDoc["#body"] = {
            doc: this.getDocFromObject(this.evalDoc(api.doc["#body"]), api['#body']),
            data: api["#body"]
          }
          tmpDoc[api.doc.group].push(apiDoc);
        }
      }
    }
    var rs = [];
    for (var i in tmpDoc) {
      var des;
      tmpDoc[i].sort((a, b) => {
        return a.order - b.order;
      });
      tmpDoc[i].order = this.doc.groups.findIndex(e => {
        return Object.keys(e).indexOf(i) !== -1;
      });
      if (tmpDoc[i].order < 0) {
        console.warn(`Not declare group "${i}" in _doc.js yet`);
        tmpDoc[i].order = 100;
        des = "Not set group description yet";
      } else {
        des = this.doc.groups[tmpDoc[i].order][i];
      }
      rs.push({
        des: des,
        apis: tmpDoc[i]
      });
    }
    rs.sort((a, b) => {
      return a.order - b.order;
    });
    this.getVersion((version) => {
      cb({version: version, testcases: rs, path: this.config.path, name: this.config.name, browser: this.config.browser, team: this.config.team});
    });
  }

  getVersion(fcDone){
    try{
      var rs = [];
      var temp;
      var pathVersion = path.join(__dirname, '..', this.config.path, '_version.http');
      var rl = readline.createInterface({
        input: fs.createReadStream(pathVersion)
      });
      rl.on('line', function(line) {
        if((!temp || !temp.content) && line.trim().length === 0) return;
        var m = line.match(/^#\s*version\s*:?\s*([^\n|\r]+)/i);
        if(m) {
          if(!temp) temp = {};
          else if(temp.content){
            temp.content = temp.content.join('\n');
            rs.push(temp);
            temp = {};
          }
          temp.code = m[1].trim();
        }else{
          m = line.match(/^#\s*date\s*:?\s*([^\n|\r]+)/i);
          if(m) {
            if(!temp) temp = {};
            else if(temp.content){
              temp.content = temp.content.join('\n');
              rs.push(temp);
              temp = {};
            }
            temp.date = new Date(m[1].trim());
          }else{
            if(temp){
              if(!temp.content) temp.content = [];
              temp.content.push(line);
            }
          }
        }
      }).on('close', function() {
        if(temp && temp.content){
          temp.content = temp.content.join('\n');
          rs.push(temp);
          temp = {};
        }
        fcDone(rs);
      });
    }catch(e){ throw `Could not find ${pathVersion}`; }    
    
    return rs;
  }

  getDocFromObject(doc, item) {
    var d = {};
    if (item instanceof Array) {
      var types = this.getType(doc['#'], item);
      d = {
        type: (types instanceof Array ? types[1] : types),
        des: (types instanceof Array ? doc['#'].replace(types[0], '') : doc['#']),
        data: {}
        // value: item
      };
      if (item.length > 0) {
        for (var i in item[0]) {
          d.data[i] = this.getDocFromObject(doc[i], item[0][i]);
        }
      }
    } else if (item instanceof Object) {
      var types = this.getType(doc['#'], item);
      d = {
        type: (types instanceof Array ? types[1] : types),
        des: (types instanceof Array ? doc['#'].replace(types[0], '') : doc['#']),
        data: {}
        // value: item
      };
      for (var i in item) {
        d.data[i] = this.getDocFromObject(doc[i], item[i]);
      }
    } else {
      var types = this.getType(doc, item);
      d = {
        type: (types instanceof Array ? types[1] : types),
        des: (types instanceof Array ? doc.replace(types[0], '') : doc)
        // value: item
      };
    }
    return d;
  }

  evalDoc(doc) {
    var docDeclare = {};
    for (var docname of doc.split('|')) {
      docDeclare = Utils.assign(docDeclare, eval(`this.doc.describe["${docname}"]`));
      for(var k in docDeclare){
        var m = k.match(/^\$\{([^}]+)\}$/);
        if(m){
          docDeclare = Utils.assign(this.evalDoc(m[1]), docDeclare);
        }else if(typeof docDeclare[k] === 'string'){
          var m = docDeclare[k].match(/^\$\{([^}]+)\}$/);
          if(m){
            docDeclare[k] = this.evalDoc(m[1]);
          }
        }
      }
    }
    return docDeclare;
  }  

  getType(doc, value) {
    if(value instanceof Array) return 'array';
    if(value instanceof Object) return 'object';
    if (typeof value === 'number') {
      if (value % 1 === 0) return 'integer';
      return 'float';
    }else if(typeof value === 'string') {
      if(doc){
        var regexCuzDefine = /<<([^>]+)>>/;
        try{
          var m = doc.match(regexCuzDefine);
          if(m && m.length > 1) {
            return m;
          }
        }catch(e){
          return 'Error';
        }
      }
    }
    return typeof value;
  }
}