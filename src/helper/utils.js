var fs = require('fs');
var path = require('path');

exports = module.exports = {
  assign: (target, ...sources) => {
    var isObject = (item) => {
      return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    };
    let output = Object.assign({}, target);
    for(var source of sources){
      output = Object.assign(output, source);
      if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
          if (isObject(source[key])) {
            if (!(key in target))
              Object.assign(output, { [key]: source[key] });
            else
              output[key] = exports.assign(target[key], source[key]);
          } else {
            Object.assign(output, { [key]: source[key] });
          }
        });
      }
    }
    return output;
  }
}