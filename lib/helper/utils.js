var fs = require('fs');
var path = require('path');

exports = module.exports = {
  applyValue: (a) => {
    var vl = { value: a };
    if(a === undefined || a === null) return vl;
    try{
      if ((a instanceof Array) || (a instanceof Object)) {
        for (var i in a) {
          a[i] = exports.applyValue(a[i]).value;
        }
      } else if (a !== undefined && a !== null && a.length > 0 && typeof a === 'string') {
        var m = a.match(/^\$\{([^}]+)\}$/);
        if (m) {
          var vname = m[1];
          try {
            a = eval(`global.var.${vname}`);
          } catch (e) {
            throw `Variable "${vname}" is not defined`;
          }
        } else {
          var r = /\$\{([^}]+)\}/g;
          var m;
          while ((m = r.exec(a)) !== null) {
            var vname = m[1];
            try {
              a = a.replace(m[0], eval(`global.var.${vname}`));
            } catch (e) {              
              throw `Variable "${vname}" is not defined`;
            }
          }
        }
      }
      vl.value = a;
    }catch(e){
      vl.value = a;
      vl.error = e;
      console.error(e);
    }
    return vl;
  },
  arrayCompare(a, b) {
    if (a.length !== b.length) return false;
    for (var i in a) {
      if (a[i] instanceof Array) {
        if (!exports.arrayCompare(a[i], b[i])) return false;
      } else if (a[i] instanceof Object) {
        if (!exports.objectCompare(a[i], b[i])) return false;
      } else if (a[i] !== b[i])
        return false;
    }
    return true;
  },
  objectCompare: (a, b) => {
    // if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (var i in a) {
      if (a[i] instanceof Array) {
        if (!exports.arrayCompare(a[i], b[i])) return false;
      } else if (a[i] instanceof Object) {
        if (!exports.objectCompare(a[i], b[i])) return false;
      } else if (a[i] !== b[i])
        return false;
    }
    return true;
  },
  anyCompare: (a, b) => {
    if (a instanceof Array) {
      if (!exports.arrayCompare(a, b)) return false;
    } else if (a instanceof Object) {
      if (!exports.objectCompare(a, b)) return false;
    } else if (a !== b) return false;
    return true;
  },
  arrayContains: (a, b) => {
    if (b.length > a.length) return false;
    for (var i in b) {
      var isContains = false;
      for (var j in a) {
        if (exports.anyCompare(a[j], b[i])) {
          isContains = true;
          break;
        }
      }
      if (!isContains) return false;
    }
    return true;
  },
  arrayNotContains: (a, b) => {
    for (var i in b) {
      var isContains = false;
      for (var j in a) {
        if (exports.anyCompare(a[j], b[i])) {
          isContains = true;
          break;
        }
      }
      if (isContains) return false;
    }
    return true;
  },
  assign: (target, ...sources) => {
    var isObject = (item) => {
      return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    };
    let output = Object.assign({}, target);
    for (var source of sources) {
      output = Object.assign(output, source);
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
          if (isObject(source[key])) {
            if (!(key in target))
              Object.assign(output, {
                [key]: source[key]
              });
            else
              output[key] = exports.assign(target[key], source[key]);
          } else {
            Object.assign(output, {
              [key]: source[key]
            });
          }
        });
      }
    }
    return output;
  }
}