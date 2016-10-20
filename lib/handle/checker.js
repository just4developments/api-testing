var utils = require('../helper/utils');
exports = module.exports = {

  status: (code, headers, body, newStatus, opts) => {

    if (newStatus) {
      if (newStatus instanceof Array) {
        if (newStatus.indexOf(code) === -1) {
          throw {
            mes: 'Check response status failed',
            details: [`Actuality is ${code}. Expection is in [${newStatus.join(',')}]`]
          };
        }
      } else if (newStatus !== code) {
        throw {
          mes: 'Check response status failed',
          details: [`Actuality is ${code}. Expection is ${newStatus}`]
        };
      }
    }
  },

  // instanceof: (code, headers, body, newType) => {
  //   if (!utils.typeCompare(body, newType)) {
  //     throw {
  //       mes: 'Check instanceof failed'
  //     };
  //   }
  // },

  // size: (code, headers, body, newSize, opts) => {
  //   if (!body ||
  //     (typeof newSize === 'number' && body.length !== newSize) ||
  //     (newSize instanceof Object &&
  //       (newSize['='] && body.length !== newSize['=']) ||
  //       (newSize['>'] && body.length <= newSize['>']) ||
  //       (newSize['>='] && body.length < newSize['>=']) ||
  //       (newSize['<'] && body.length >= newSize['<']) ||
  //       (newSize['<='] && body.length > newSize['<=']))
  //   ) {
  //     throw {
  //       mes: 'Check data size failed',
  //       expect: newSize,
  //       actual: body.length
  //     };
  //   }
  // },

  contains: (code, headers, body, newBody, opts) => {
    if (!utils.arrayContains(body, !(newBody instanceof Array) ? [newBody] : newBody, opts)) {
      throw {
        mes: 'Check data contains failed'
      };
    }
  },

  equals: (code, headers, body, newBody, opts) => {
    if (!utils.anyCompare(body, newBody, false, opts)) {
      throw {
        mes: 'Check data equals failed',
        details: utils.mes.reverse()
      };
    }
  },

  in: (code, headers, body, newBody, opts) => {
    if (!utils.arrayContains(body, !(newBody instanceof Array) ? [newBody] : newBody, opts)) {
      throw {
        mes: 'Check data in failed'
      };
    }
  },

  notContains: (code, headers, body, newBody, opts) => {
    if (!utils.arrayNotContains(body, !(newBody instanceof Array) ? [newBody] : newBody, opts)) {
      throw {
        mes: 'Check data not contains failed'
      };
    }
  },

  notEquals: (code, headers, body, newBody, opts) => {
    if (utils.anyCompare(newBody, body, true, opts)) {
      throw {
        mes: 'Check data not equals failed',
        details: utils.mes.reverse()
      };
    }
  },

  notIn: (code, headers, body, newBody, opts) => {
    if (utils.arrayNotContains(!(newBody instanceof Array) ? [newBody] : newBody), opts) {
      throw {
        mes: 'Check data not in failed'
      };
    }
  }

};