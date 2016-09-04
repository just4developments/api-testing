var unirest = require('unirest');
var Utils = require('../helper/utils');

class Checker {

  status(status) {
    if (status) {
      if (this.config.checker.status instanceof Array) return this.config.checker.status.indexOf(status) !== -1;
      return status === this.config.checker.status;
    }
    return true;
  }

  arrayCompare(a, b) {
    if (a.length !== b.length) return false;
    for (var i in a) {
      if (a[i] instanceof Array) {
        if (!this.arrayCompare(a[i], b[i])) return false;
      } else if (a[i] instanceof Object) {
        if (!this.objectCompare(a[i], b[i])) return false;
      } else if (a[i] !== b[i])
        return false;
    }
    return true;
  }

  objectCompare(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (var i in a) {
      if (a[i] instanceof Array) {
        if (!this.arrayCompare(a[i], b[i])) return false;
      } else if (a[i] instanceof Object) {
        if (!this.objectCompare(a[i], b[i])) return false;
      } else if (a[i] !== b[i])
        return false;
    }
    return true;
  }

  anyCompare(a, b) {
    if (a instanceof Array) {
      if (!this.arrayCompare(a, b)) return false;
    } else if (a instanceof Object) {
      if (!this.objectCompare(a, b)) return false;
    } else if (a !== b) return false;
    return true;
  }

  arrayContains(a, b) {
    if (b.length > a.length) return false;
    for (var i in b) {
      var isContains = false;
      for (var j in a) {
        if (this.anyCompare(a[j], b[i])) {
          isContains = true;
          break;
        }
      }
      if (!isContains) return false;
    }
    return true;
  }

  arrayNotContains(a, b) {
    for (var i in b) {
      var isContains = false;
      for (var j in a) {
        if (this.anyCompare(a[j], b[i])) {
          isContains = true;
          break;
        }
      }
      if (isContains) return false;
    }
    return true;
  }
}

module.exports = class Api extends Checker {

  constructor(config, defaultConfig = {}) {
    super();
    this.config = Utils.assign(defaultConfig, config);
    this.config.transform = this.config.transform.toLowerCase();
    if(this.config.sleep === undefined) this.config.sleep = 0;
    if (!this.config.method) {
      var i = this.config.url.indexOf(' ');
      if(i !== -1){
        this.config.method = this.config.url.substr(0, i);
        this.config.url = this.config.url.substr(i + 1);
      }else{
        this.config.method = 'get';
      }
    }
    this.config.method = this.config.method.toLowerCase();
    this.config.name = this.applyValue(this.config.name);
    this.config.des = this.applyValue(this.config.des);
    this.config.url = this.applyValue(this.config.url);    
    if (this.config.header) this.config.header = this.applyValue(this.config.header);
    if(this.config.body) this.config.body = this.applyValue(this.config.body);
    if (this.config.checker) {      
      for(var i in this.config.checker){
        this.config.checker[i] = this.applyValue(this.config.checker[i]);
      }
    }
  }

  applyValue(a) {
    if ((a instanceof Array) || (a instanceof Object)) {
      for (var i in a) {
        a[i] = this.applyValue(a[i]);
      }
    } else if (a !== undefined && a !== null && a.length > 0 && typeof a === 'string') {
      var m = a.match(/^\$\{([^}]+)\}$/);
      if (m) {
        var vname = m[1];
        a = eval(`global.var.${vname}`);
      } else {
        var r = /\$\{([^}]+)\}/g;
        var m;
        while ((m = r.exec(a)) !== null) {
          var vname = m[1];
          a = a.replace(m[0], eval(`global.var.${vname}`));
        }
      }
    }
    return a;
  }

  checker(res) {    
    if (this.config.checker) {
      if (this.config.checker.status) {
        if (!this.status(res.code)) {
          throw {
            mes: 'Check response status failed',
            expect: this.config.checker.status,
            actual: res.code
          };
        }
      }
      if (this.config.checker.size !== undefined) {
        if (this.config['#body'].length !== this.config.checker.size)
          throw {
            mes: 'Check data size failed',
            expect: this.config.checker.size,
            actual: this.config['#body'].length
          };
      }
      if (this.config.checker.equals) {
        if (!this.anyCompare(this.config.checker.equals, this.config['#body']))
          throw {
            mes: 'Check data equals failed',
            expect: this.config.checker.equals,
            actual: this.config['#body']
          };
      }
      if (this.config.checker['!equals']) {
        if (this.anyCompare(this.config.checker['!equals'], this.config['#body']))
          throw {
            mes: 'Check data no equals failed'
          };
      }
      if (this.config.checker.contains) {
        if (!(this.config.checker.contains instanceof Array)) {
          this.config.checker.contains = [this.config.checker.contains];
        }
        if (!this.arrayContains(this.config['#body'], this.config.checker.contains))
          throw {
            mes: 'Check data contains failed'
          };
      }
      if (this.config.checker['!contains']) {
        if (!(this.config.checker['!contains'] instanceof Array)) {
          this.config.checker['!contains'] = [this.config.checker['!contains']];
        }
        if (!this.arrayNotContains(this.config['#body'], this.config.checker['!contains']))
          throw {
            mes: 'Check data not contains failed'
          };
      }
      if (this.config.checker.in) {
        if (!(this.config.checker.in instanceof Array)) {
          this.config.checker.in = [this.config.checker.in];
        }
        if (!this.arrayContains(this.config.checker.in, this.config['#body']))
          throw {
            mes: 'Check data in failed'
          };
      }
      if (this.config.checker['!in']) {
        if (!(this.config.checker['!in'] instanceof Array)) {
          this.config.checker['!in'] = [this.config.checker['!in']];
        }
        if (this.arrayNotContains(this.config.checker['!in'], this.config['#body']))
          throw {
            mes: 'Check data not in failed'
          };
      }
    }
  }

  exec(cb0) {
    console.log(this.config.method.toUpperCase(), this.config.url, `(sleep ${this.config.sleep} ms)`);
    var self = this;
    var cb = (err) => {
      setTimeout(() => {
        cb0(err, self.config);
      }, this.config.sleep);      
    };
    var req;
    var body = Utils.assign({}, this.config.body);
    var handleForm = () => {
      var files;
      for(var k in body){			
        if(k.indexOf('file:') === 0){
          var key = k.substr('file:'.length);
          if(!files) files = {};
          files[key] = body[k];
          delete body[k];
        }
      }
      if(files){
        for(var k in files){
          if(files[k] instanceof Array){
            for(var i in files[k]){
              req = req.attach(k, files[k][i]);
            }
          }else{
            req = req.attach(k, files[k]);
          }
        }
        for(var k in body){
          req = req.field(k, body[k]);
        }		
      }
    };
    if ('post' === this.config.method) {
      req = unirest.post(this.config.url);      
      if('form' === this.config.transform) handleForm();
      else req = req.send(JSON.stringify(body));  
    } else if ('put' === this.config.method) {
      req = unirest.put(this.config.url);
      if('form' === this.config.transform) handleForm();
      else req = req.send(JSON.stringify(body));
    } else if ('delete' === this.config.method) {
      req = unirest.delete(this.config.url);
    } else if ('head' === this.config.method) {
      req = unirest.head(this.config.url);
    } else {
      req = unirest.get(this.config.url);
    }
    if (this.config.header) req = req.headers(this.config.header);  
    var startTime = new Date().getTime();  
    req.end(res => {
      self.config.duration = new Date().getTime() - startTime;
      if(!res.code){
        self.config["#status"] = res.error.code;
        self.config.error = res.error.message;
        return cb(res.error);
      }
      self.config["#status"] = res.code;
      self.config['#header'] = res.headers;
      self.config['#body'] = res.body;
      // if ('json' === self.config.parser) self.config['#body'] = JSON.parse(self.config['#body']);      
      if (self.config.var) self.config["#var"] = global.var[self.config.var] = { header: self.config['#header'], body: self.config['#body'] };
      try {
        if('test' === global.action) self.checker(res);
        if (self.config.end) self.config.end(cb);
        else cb();
      } catch (e) {
        self.config.error = e;
        cb(e);
      }
    });    
  }

}