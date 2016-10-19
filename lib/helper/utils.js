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
  // arrayCompare(a, b, isNotEquals) {
  //   if (a.length !== b.length) {
  //     exports.mes.push(`Length had problem`);
  //     return false;
  //   }
  //   for (var i in a) {
  //     if (a[i] instanceof Array) {
  //       if (!isNotEquals && !exports.arrayCompare(a[i], b[i], isNotEquals)) {
  //         exports.mes.push(`Index at ${i}`);
  //         return false;
  //       } else if (isNotEquals && exports.arrayCompare(a[i], b[i], isNotEquals)) {
  //         exports.mes.push(`Index at ${i}`);
  //         return true;
  //       }
  //     } else if (a[i] instanceof Object) {
  //       if (!isNotEquals && !exports.objectCompare(a[i], b[i], isNotEquals)) {
  //         exports.mes.push(`Key at ${i}`);
  //         return false;
  //       } else if (isNotEquals && exports.objectCompare(a[i], b[i], isNotEquals)) {
  //         exports.mes.push(`Key at ${i}`);
  //         return true;
  //       }
  //     } else if (!isNotEquals && a[i] !== b[i]) {
  //       exports.mes.push(`Field ${i} ( ${a[i]} !== ${b[i]} )`);
  //       return false;
  //     } else if (isNotEquals && a[i] === b[i]) {
  //       exports.mes.push(`Field ${i} ( ${a[i]} === ${b[i]} )`);
  //       return true;
  //     }
  //   }
  //   return !isNotEquals;
  // },
  anyCompare: (a, b, isNotEquals, opts) => {
    // if (Object.keys(a).length !== Object.keys(b).length) return false;
    if (opts._ignoreUndefined === true && b === undefined) {
      return !isNotEquals;
    } else if ('function' === typeof b) {
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
  // anyCompare1: (a, b, isNotEquals) => {
  //   if ('function' === typeof b) {
  //     if (!isNotEquals && !exports.typeCompare(a, b)) {
  //       exports.mes.push(`Data is NOT instanceof ${b.name}${b.more || ''}`);
  //       b = `$(${b.name}${b.more || ''})`;
  //       return false;
  //     } else if (isNotEquals && exports.typeCompare(a, b)) {
  //       exports.mes.push(`Data is instanceof ${b.name}${b.more || ''}`);
  //       b = `$(${b.name}${b.more || ''})`;
  //       return true;
  //     }
  //     return !isNotEquals;
  //   } else if (a instanceof Array)
  //     return exports.arrayCompare(a, b, isNotEquals);
  //   else if (a instanceof Object)
  //     return exports.objectCompare(a, b, isNotEquals);
  //   return (a === b);
  // },
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
      } else if (type == Date.name && typeof a === 'string') {
        try {
          new Date(a);
          return true;
        } catch (e) {
          return false;
        }
      } else if (type === Length.name && (a instanceof Array || typeof a === 'string')) {
        var isOk = true;
        if (b.value instanceof Array) {
          if (b.value[0] !== Any) {
            isOk &= a.length >= b.value[0];
          }
          if (b.value[1] !== Any) {
            isOk &= a.length <= b.value[1];
          }
          if (!isNotEquals && !isOk) {
            exports.mes.push(`Actuality is Length(${a.length}). Expection is Length${b.more}`);
          } else if (isNotEquals && isOk) {
            exports.mes.push(`Actuality is Length(${a.length}). Expection is NOT Length${b.more}`);
          }
        } else {
          isOk = b.value === a.length;
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
  },
  merge: (target, ...sources) => {
    var isObject = (item) => {
      return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    };
    var isArray = (item) => {
      return (item && item instanceof Array);
    };
    // var isType = (item) => {
    //   return typeof item === 'function';
    // };
    let output = Object.assign({}, target);
    for (var source of sources) {
      output = Object.assign(output, source);
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
          // if (isType(source[key] && source[key].name === Remove.name)) {
          //   delete output[key];
          //   delete source[key];
          // } else 
          if (isObject(source[key])) {
            if (!(key in target))
              Object.assign(output, {
                [key]: source[key]
              });
            else
              output[key] = exports.merge(target[key], source[key]);
          } else if (isArray(target[key]) && isArray(source[key])) {
            for (var i in target[key]) {
              var isContains = false;
              for (var j in source[key]) {
                if (target[key][i] == source[key][j]) {
                  isContains = true;
                  output[key][i] = exports.merge(target[key][i], source[key][j]);
                  break;
                }
              }
              if (!isContains) {
                output[key].splice(0, 0, target[key][i]);
              }
            }
          } else {
            Object.assign(output, {
              [key]: source[key]
            });
          }
        });
      }
    }
    return output;
  },
  assign: (target, ...sources) => {
    var isObject = (item) => {
      return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    };
    var isArray = (item) => {
      return (item && item instanceof Array);
    };
    // var isType = (item) => {
    //   return typeof item === 'function';
    // };
    let output = Object.assign({}, target);
    for (var source of sources) {
      output = Object.assign(output, source);
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
          // if (isType(source[key] && source[key].name === Remove.name)) {
          //   delete output[key];
          //   delete source[key];
          // } else 
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