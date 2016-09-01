var unirest = require('unirest');

class Checker {

  status(status) {
    if (status) {
      if (status instanceof Array) return status.indexOf(this.config.checker.status) !== -1;
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

  constructor(config) {
    super();
    this.config = config;
    if (!this.config.method) {
      var i = this.config.url.indexOf(' ');
      this.config.method = this.config.url.substr(0, i);
      this.config.url = this.config.url.substr(i + 1);
    }
    this.config.method = this.config.method.toLowerCase();
    if (this.config.checker) this.config.checker.parser = (this.config.checker.parser || 'json').toLowerCase();
  }

  applyValue(a) {
    if (a instanceof Array) {
      for (var i = 0; i < a.length; i++) {
        a[i] = this.applyValue(a[i]);
      }
    } else if (a instanceof Object) {
      a = this.applyValue(a);
    } else if (typeof a === 'string') {
      var m = a.match(/^\$\{([^}]+)\}$/g);
      if(m){
        var vname = m[i].match(/\$\{(\w+)\}/)[1];
        a = eval(`global.var.${vname}.`);
      }else {
        m = a.match(/\$\{([^}]+)\}/);
        if (m) {
          for (var i in m) {
            var vname = m[i].match(/\$\{([^}]+)\}/)[1];
            a = a.replace(m[i], eval(`global.var.${vname}`));
          }
        }
      }
    }
    return a;
  }

  checker(res) {
    this.config.content = res.raw_body;
    if ('json' === this.config.parser) this.config.content = JSON.parse(this.config.content);
    // TODO: ...... HERE
    console.log('aaaaaaaaaaa', this.config.var);
    if (this.config.var) {      
      global.var[this.config.var] = this.config.content;
    }
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
        if (this.config.content.length !== this.config.checker.size)
          throw {
            mes: 'Check data size failed',
            expect: this.config.checker.size,
            actual: this.config.content.length
          };
      }
      if (this.config.checker.equals) {
        if (!this.anyCompare(this.config.checker.equals, this.config.content))
          throw 'Check data equals failed';
      }
      if (this.config.checker['!equals']) {
        if (this.anyCompare(this.config.checker['!equals'], this.config.content))
          throw 'Check data no equals failed';
      }
      if (this.config.checker.contains) {
        if (!(this.config.checker.contains instanceof Array)) {
          this.config.checker.contains = [this.config.checker.contains];
        }
        if (!this.arrayContains(this.config.content, this.config.checker.contains))
          throw 'Check data contains failed';
      }
      if (this.config.checker['!contains']) {
        if (!(this.config.checker['!contains'] instanceof Array)) {
          this.config.checker['!contains'] = [this.config.checker['!contains']];
        }
        if (!this.arrayNotContains(this.config.content, this.config.checker['!contains']))
          throw 'Check data not contains failed';
      }
      if (this.config.checker.in) {
        if (!(this.config.checker.in instanceof Array)) {
          this.config.checker.in = [this.config.checker.in];
        }
        if (!this.arrayContains(this.config.checker.in, this.config.content))
          throw 'Check data in failed';
      }
      if (this.config.checker['!in']) {
        if (!(this.config.checker['!in'] instanceof Array)) {
          this.config.checker['!in'] = [this.config.checker['!in']];
        }
        if (this.arrayNotContains(this.config.checker['!in'], this.config.content))
          throw 'Check data not in failed';
      }
    }
  }

  exec() {
    console.log('a', global.var);
    this.config.url = this.applyValue(this.config.url);
    console.log(this.config.method.toUpperCase(), this.config.url);
    var self = this;
    var req;
    if ('post' === this.config.method) {
      req = unirest.post(this.config.url);
      req = req.send(JSON.stringify(body));
    } else if ('put' === this.config.method) {
      req = unirest.put(this.config.url);
      req = req.send(JSON.stringify(body));
    } else if ('delete' === this.config.method) {
      req = unirest.delete(this.config.url);
    } else if ('head' === this.config.method) {
      req = unirest.head(this.config.url);
    } else {
      req = unirest.get(this.config.url);
    }
    if (this.config.headers) req = req.headers(this.config.headers);
    req.end(res => {
      try {
        self.checker(res);
      } catch (e) {
        console.error(e);
      }
      if (this.config.end) this.config.end();
    });
  }

}