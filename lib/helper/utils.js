var fs = require('fs');
var path = require('path');
var _ = require('lodash')._;

exports = module.exports = {
  mes: [],
  clone: (a) => {
    if (typeof a === 'function') {
      return a;
    } else if (typeof a === 'object') {
      for (var i in a) {
        a[i] = exports.clone(a[i]);
      }
      return a;
    }
    return _.clone(a);
  },
  union: (target, sources, isObject) => {
    var rs = _.union(_.clone(target), sources);
    var getKey = (obj) => {
      return Object.keys(obj).find(e => {
        return e.indexOf('_') === -1;
      });
    }
    if (isObject) {
      var rmIndex = [];
      for (var i = 0; i < rs.length - 1; i++) {
        var ikey = getKey(rs[i]);
        for (var j = i + 1; j < rs.length; j++) {
          var jkey = getKey(rs[j]);
          if (ikey === jkey) {
            rmIndex.push(i);
            break;
          }
        }
      }
      for (var i in rmIndex) {
        rs.splice(i, 1);
      }
    }
    return rs;
  },
  assign: (target, sources) => {
    return _.merge(_.clone(target), sources);
  },
  applyType(a) {
    var b = _.clone(a);
    if ('function' === typeof b || b instanceof CustomType) {
      b = `$(${b.name}${b.more || ''})`;
    } else if (b && (b instanceof Object || b instanceof Array)) {
      for (var i in b) {
        b[i] = exports.applyType(b[i]);
      }
    }
    return b;
  },
  applyValue: (a) => {
    var vl = {
      value: a
    };
    if (a === undefined || a === null || typeof a === 'function') return vl;
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
            a = exports.clone(eval(`global.var.${vname}`));
          } catch (e) {
            throw `Variable "${vname}" is not defined`;
          }
        } else {
          var r = /\$\{([^}]+)\}/g;
          var m;
          var tmp = new String(a);
          while ((m = r.exec(tmp)) !== null) {
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
  anyCompare: (a, b, isNotEquals, opts) => {
    // if (Object.keys(a).length !== Object.keys(b).length) return false;
    if (opts._ignoreUndefined === true && b === undefined) {
      return !isNotEquals;
    } else if ('function' === typeof b || b instanceof CustomType) {
      if (b.name === Remove.name) {
        return !isNotEquals;
      } else if (!isNotEquals && !exports.typeCompare(a, b)) {
        return false;
      } else if (isNotEquals && exports.typeCompare(a, b)) {
        return true;
      }
    } else if (a instanceof Array || a instanceof Object) {
      for (var i in a) {
        if (!isNotEquals && !exports.anyCompare(a[i], b[i], isNotEquals, opts)) {
          exports.mes.push(`<${i}> field`);
          return false;
        } else if (isNotEquals && exports.anyCompare(a[i], b[i], isNotEquals, opts)) {
          exports.mes.push(`<${i}> field`);
          return true;
        }
      }
    } else if (!isNotEquals && a !== b) {
      exports.mes.push(`Actuality is ${a}. Expection is ${b}`);
      return false;
    } else if (isNotEquals && a === b) {
      exports.mes.push(`Actuality is ${a}. Expection is not ${b}`);
      return true;
    }
    return !isNotEquals;
  },
  typeCompare: (a, b, isNotEquals) => {
    var isNullOrEmpty = b.name.includes('able');
    var type = b.name.replace('able', '');
    if (type === Any.name) return true;
    if (!isNullOrEmpty && (a === undefined || a === null)) {
      if (!isNotEquals) {
        exports.mes.push(`Actuality is ${a}. Expection is ${b.name}`);
      }
      return false;
    } else if (isNullOrEmpty && (a === undefined || a === null)) {
      if (isNotEquals) {
        exports.mes.push(`Actuality is ${a}. Expection is NOT ${b.name}`);
      }
      return true;
    } else if (type !== RegExp.name) {
      if (typeof a === type.toLowerCase()) {
        if (isNotEquals) {
          exports.mes.push(`Actuality is ${a}. Expection is NOT ${type}`);
        }
        return true;
      } else if (type == Date.name) {
        if (a instanceof Date) return true;
        else if (typeof a === 'string') {
          try {
            new Date(a);
            return true;
          } catch (e) {}
        }
        return false;
      } else if (type === Length.name && (a instanceof Array || typeof a === 'string')) {
        var isOk = b.isValid(a);
        if (b.value instanceof Array) {
          if (!isNotEquals && !isOk) {
            exports.mes.push(`Actuality is Length(${a.length}). Expection is Length${b.more}`);
          } else if (isNotEquals && isOk) {
            exports.mes.push(`Actuality is Length(${a.length}). Expection is NOT Length${b.more}`);
          }
        } else {
          if (!isNotEquals && !isOk) {
            exports.mes.push(`Actuality is Length(${a.length}). Expection is Length${b.more}`);
          } else if (isNotEquals && isOk) {
            exports.mes.push(`Actuality is Length(${a.length}). Expection is NOT Length${b.more}`);
          }
        }
        return isOk;
      } else if (a instanceof b) {
        if (isNotEquals) {
          exports.mes.push(`Actuality is ${a}. Expection is NOT ${b.name}`);
        }
        return true;
      }
      if (!isNotEquals) {
        exports.mes.push(`Actuality is ${a}. Expection is ${b.name}`);
      }
      return false;
    }
    var isOk = b.test(a);
    if (!isNotEquals && !isOk) {
      exports.mes.push(`Actuality is ${a}. Expection is ${b.name}(${b.toString()})`);
    } else if (isNotEquals && isOk) {
      exports.mes.push(`Actuality is ${a}. Expection is NOT ${b.name}(${b.toString()})`);
    }
    return isOk;
  },
  arrayContains: (a, b, opts) => {
    if (b.length > a.length) {
      exports.mes.push(`Length had problem`);
      return false;
    }
    for (var i in b) {
      var isContains = false;
      for (var j in a) {
        if (exports.anyCompare(a[j], b[i], false, opts)) {
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
  arrayNotContains: (a, b, opts) => {
    for (var i in b) {
      var isContains = false;
      for (var j in a) {
        if (exports.anyCompare(a[j], b[i], true, opts)) {
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
  convert: (obj) => {
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
  }
}