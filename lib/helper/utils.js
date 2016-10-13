var fs = require('fs');
var path = require('path');

exports = module.exports = {
  mes: [],
  applyValue: (a) => {
    var vl = {
      value: a
    };
    if (a === undefined || a === null) return vl;
    try {
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
    } catch (e) {
      vl.value = a;
      vl.error = e;
      console.error(e);
    }
    return vl;
  },
  arrayCompare(a, b, isNotEquals) {
    if (a.length !== b.length) {
      exports.mes.push(`Length had problem`);
      return false;
    }
    for (var i in a) {
      if (a[i] instanceof Array) {
        if (!isNotEquals && !exports.arrayCompare(a[i], b[i], isNotEquals)) {
          exports.mes.push(`Index at ${i}`);
          return false;
        } else if (isNotEquals && exports.arrayCompare(a[i], b[i], isNotEquals)) {
          exports.mes.push(`Index at ${i}`);
          return true;
        }
      } else if (a[i] instanceof Object) {
        if (!isNotEquals && !exports.objectCompare(a[i], b[i], isNotEquals)) {
          exports.mes.push(`Key at ${i}`);
          return false;
        } else if (isNotEquals && exports.objectCompare(a[i], b[i], isNotEquals)) {
          exports.mes.push(`Key at ${i}`);
          return true;
        }
      } else if (!isNotEquals && a[i] !== b[i]) {
        exports.mes.push(`Field "${i}" ( ${a[i]} !== ${b[i]} )`);
        return false;
      } else if (isNotEquals && a[i] === b[i]) {
        exports.mes.push(`Field "${i}" ( ${a[i]} === ${b[i]} )`);
        return true;
      }
    }
    return !isNotEquals;
  },
  objectCompare: (a, b, isNotEquals) => {
    // if (Object.keys(a).length !== Object.keys(b).length) return false;
    for (var i in a) {
      if (a[i] instanceof Array) {
        if (!isNotEquals && !exports.arrayCompare(a[i], b[i], isNotEquals)) {
          exports.mes.push(`Array index ${i}`);
          return false;
        } else if (isNotEquals && exports.arrayCompare(a[i], b[i], isNotEquals)) {
          exports.mes.push(`Array index ${i}`);
          return true;
        }
      } else if (a[i] instanceof Object) {
        if (!isNotEquals && !exports.objectCompare(a[i], b[i], isNotEquals)) {
          exports.mes.push(`Object key "${i}"`);
          return false;
        } else if (isNotEquals && exports.objectCompare(a[i], b[i], isNotEquals)) {
          exports.mes.push(`Object key "${i}"`);
          return true;
        }
      } else if ('function' === typeof b[i]) {
        if (!exports.typeCompare(a[i], b[i])) {
          b[i] = `$(${b[i].name})`;
          return false;
        }
        b[i] = `$(${b[i].name})`;
      } else if (!isNotEquals && a[i] !== b[i]) {
        exports.mes.push(`Field "${i}" ( ${a[i]} !== ${b[i]} )`);
        return false;
      } else if (isNotEquals && a[i] === b[i]) {
        exports.mes.push(`Field "${i}" ( ${a[i]} === ${b[i]} )`);
        return true;
      }
    }
    return !isNotEquals;
  },
  anyCompare: (a, b, isNotEquals) => {
    if (a instanceof Array)
      return exports.arrayCompare(a, b, isNotEquals);
    else if (a instanceof Object)
      return exports.objectCompare(a, b, isNotEquals);
    return (a === b);
  },
  typeCompare: (a, b) => {
    var isNullOrEmpty = b.name.includes('able');
    var type = b.name.replace('able', '');
    if (type === Any.name) return true;
    if (!isNullOrEmpty && (a === undefined || a === null)) return false;
    else if (isNullOrEmpty && (a === undefined || a === null)) return true;
    if (type !== RegExp.name) {
      if (typeof a === type.toLowerCase()) return true;
      else if (a instanceof b) return true;
      return false;
    }
    return b.test(a);
  },
  arrayContains: (a, b) => {
    if (b.length > a.length) {
      exports.mes.push(`Length had problem`);
      return false;
    }
    for (var i in b) {
      var isContains = false;
      for (var j in a) {
        if (exports.anyCompare(a[j], b[i])) {
          isContains = true;
          break;
        }
      }
      if (!isContains) {
        exports.mes.push(`Array index ${i}`);
        return false;
      } else {
        exports.mes = [];
      }
    }
    return true;
  },
  arrayNotContains: (a, b) => {
    for (var i in b) {
      var isContains = false;
      for (var j in a) {
        if (exports.anyCompare(a[j], b[i], true)) {
          isContains = true;
          break;
        }
      }
      if (isContains) {
        exports.mes.push(`Item at ${i}`);
        return false;
      }
    }
    return true;
  },
  ignoreUndefined: (obj) => {
    var removeInObject = (obj) => {
      for (var i in obj) {
        if (typeof obj[i] === 'function' && obj[i].name === Remove.name) {
          delete obj[i];
        } else if (obj[i] instanceof Object || obj[i] instanceof Array) {
          obj[i] = removeInObject(obj[i]);
        }
      }
      return obj;
    }
    return removeInObject(obj);
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