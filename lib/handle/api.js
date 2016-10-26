var unirest = require('unirest');
var utils = require('../helper/utils');
var Main = require('./main');

const varKeywords = ['utils'];

class Api {

  constructor(config, defaultConfig0 = {}) {
    if (config.var && varKeywords.indexOf(config.var) !== -1) {
      throw `Your variable ${config['var']} must be not in keywords ${varKeywords.join(',')}`;
    }
    var defaultConfig = utils.clone(defaultConfig0);
    if (config.extends) {
      defaultConfig = utils.assign(defaultConfig, Api.templates[config.extends]);
      if (!config) throw `API template "${config.extends}" is not declared yet to extends`;
      delete defaultConfig.disabled;
    }
    var checkers = utils.union(defaultConfig.checker, config.checker, true);
    delete defaultConfig.checker;
    delete config.checker;
    this.config = utils.assign(defaultConfig, config);
    this.config.checker = checkers;
    if (this.config.nextCallAfter === undefined) this.config.nextCallAfter = 0;
    if (!this.config.method) {
      var i = this.config.url.indexOf(' ');
      if (i !== -1) {
        this.config.method = this.config.url.substr(0, i);
        this.config.url = this.config.url.substr(i + 1);
      } else {
        this.config.method = 'get';
      }
    }
    this.config.method = this.config.method.toLowerCase();

    if (this.config.key && this.config.key !== this.config.extends) {
      Api.templates[this.config.key] = utils.clone(this.config);
    }
    if (!this.config.disabled) this.config.index = ++Api.index;
  }

  applyValue(a) {
    a = utils.applyValue(a);
    if (a.error) {
      this.config.error = {
        mes: a.error
      };
    }
    return a.value;
  }

  check() {
    if (this.config.checker) {
      for (var i in this.config.checker) {
        var checkerObj = this.config.checker[i];
        var checkerName;
        for (var k of Object.keys(checkerObj)) {
          if (k.indexOf('_') !== 0) {
            checkerName = k;
            break;
          }
        }
        var checkerFnc;
        // try{
        checkerFnc = global.checker[checkerName];
        if (!checkerFnc) {
          throw {
            mes: `Checker "${checkerName}" is not defined`
          };
        }
        var opts = {};
        if (checkerObj._apply !== undefined) {
          checkerObj[checkerName] = checkerObj._apply(checkerObj[checkerName]);
          delete checkerObj._apply;
        }
        if (checkerObj._ignoreUndefined !== undefined) {
          opts._ignoreUndefined = checkerObj._ignoreUndefined;
        }
        this.config.checker[i] = checkerObj;
        utils.mes = [];
        checkerFnc(this.config.responseStatus, this.config.responseHeader, this.config.responseBody, checkerObj[checkerName], opts);
      }
    }
  }

  exec(cb0) {
    this.config.url = this.applyValue(this.config.url);
    if (this.config.index === 47) {
      debugger;
    }
    console.log(this.config.index, this.config.des);
    console.log(this.config.method.toUpperCase(), this.config.url, this.config.nextCallAfter ? `... ${this.config.nextCallAfter} ms ...` : '');
    console.log('');

    if (this.config.doc && this.config.doc.title)
      this.config.title = this.applyValue(this.config.doc.title);
    this.config.des = this.applyValue(this.config.des);
    if (this.config.requestHeader)
      this.config.requestHeader = this.applyValue(this.config.requestHeader);
    if (this.config.requestBody)
      this.config.requestBody = this.applyValue(this.config.requestBody);
    if (this.config.checker) {
      for (var i in this.config.checker) {
        this.config.checker[i] = this.applyValue(this.config.checker[i]);
      }
    }

    var self = this;
    var req;
    var cb = (err) => {
      setTimeout(() => {
        cb0(err, self.config);
      }, this.config.nextCallAfter);
    };
    var handleError = (err) => {
      if (this.config.skipError) return cb();
      return cb(err);
    };
    var handleForm = (req, requestBody) => {
      var files;
      for (var k in requestBody) {
        if (k.indexOf('file:') === 0) {
          var key = k.substr('file:'.length);
          if (!files)
            files = {};
          files[key] = requestBody[k];
          delete requestBody[k];
        }
      }
      if (files) {
        for (var k in files) {
          if (files[k] instanceof Array) {
            for (var i in files[k]) {
              req = req.attach(k, files[k][i]);
            }
          } else {
            req = req.attach(k, files[k]);
          }
        }
        for (var k in requestBody) {
          req = req.field(k, requestBody[k]);
        }
      }
      return req;
    };
    if (this.config.error) {
      self.config.duration = 0;
      return handleError(this.config.error);
    }
    var requestBody;
    if (this.config.requestBody !== undefined)
      requestBody = utils.clone(this.config.requestBody);
    var transformRequest = (this.config.requestHeader && this.config.requestHeader['content-type']) ? this.config.requestHeader['content-type'].toLowerCase() : undefined;
    if ('multipart/form-data' === transformRequest || 'application/x-www-form-urlencoded' === transformRequest)
      transformRequest = 'form';
    else if ('application/json' === transformRequest)
      transformRequest = 'json';
    else
      transformRequest = undefined;
    if ('post' === this.config.method) {
      req = unirest.post(this.config.url);
      if (requestBody !== undefined) {
        if ('form' === transformRequest)
          req = handleForm(req, requestBody);
        else if ('json' === transformRequest)
          req = req.send(JSON.stringify(requestBody));
        else
          req = req.send(requestBody);
      }
    } else if ('put' === this.config.method) {
      req = unirest.put(this.config.url);
      if (requestBody !== undefined) {
        if ('form' === transformRequest)
          req = handleForm(req, requestBody);
        else if ('json' === transformRequest)
          req = req.send(JSON.stringify(requestBody));
        else
          req = req.send(requestBody);
      }
    } else if ('delete' === this.config.method) {
      req = unirest.delete(this.config.url);
    } else if ('head' === this.config.method) {
      req = unirest.head(this.config.url);
    } else {
      req = unirest.get(this.config.url);
    }
    if (this.config.requestHeader)
      req = req.headers(this.config.requestHeader);
    var startTime = new Date().getTime();
    req.end(res => {
      self.config.duration = new Date().getTime() - startTime;
      if (!res.code) {
        self.config.responseStatus = res.error.code;
        self.config.error = {
          mes: res.error.message
        };
        return handleError(res.error);
      }
      self.config.responseStatus = res.code;
      if (self.config.allowResponseHeader && self.config.allowResponseHeader.length > 0) {
        self.config.allowResponseHeader = self.config.allowResponseHeader.map(e => {
          return e.toLowerCase();
        });
        for (var k in res.headers) {
          if (self.config.allowResponseHeader.indexOf(k.toLowerCase()) !== -1) {
            if (!self.config.responseHeader)
              self.config.responseHeader = {};
            self.config.responseHeader[k] = res.headers[k];
          }
        }
      }
      self.config.responseBody = res.body;
      // if ('json' === self.config.parser) self.config.responseBody = JSON.parse(self.config.responseBody);      
      if (self.config.var) {
        self.config["#var"] = global.var[self.config.var] = {
          header: self.config.responseHeader,
          body: self.config.responseBody
        };
      }
      try {
        if ('test' === global.mode) {
          self.check();
          if (self.config.checker) self.config.checker = utils.applyType(self.config.checker);
        }
        if (self.config.end) self.config.end(self.config["#var"], cb);
        else cb();
      } catch (e) {
        if ('test' === global.mode && self.config.checker) self.config.checker = utils.applyType(self.config.checker);
        self.config.error = (e && e.mes) ? e : {
          mes: e.toString()
        };
        return handleError(e);
      }
    });
  }
}
Api.templates = {};
Api.index = 0;
module.exports = Api;