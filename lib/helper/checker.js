var utils = require('./utils');
module.exports = {

  status: (code, headers, body, newStatus) => {
    if (newStatus) {
      if (newStatus instanceof Array) {
        if (newStatus.indexOf(code) === -1) {
          throw {
            mes: 'Check response status failed',
            details: body,
            expect: newStatus,
            actual: code
          };
        }
      } else if (newStatus !== code) {
        throw {
          mes: 'Check response status failed',
          details: body,
          expect: newStatus,
          actual: code
        };
      }
    }
  },

  instanceof: (code, headers, body, newType) => {
    if (!utils.typeCompare(body, newType)) {
      throw {
        mes: 'Check instanceof failed'
      };
    }
  },

  size: (code, headers, body, newSize) => {
    if (!body ||
      (typeof newSize === 'number' && body.length !== newSize) ||
      (newSize instanceof Object &&
      (newSize['='] && body.length !== newSize['=']) ||
      (newSize['>'] && body.length <= newSize['>']) ||
      (newSize['>='] && body.length < newSize['>=']) ||
      (newSize['<'] && body.length >= newSize['<']) ||
      (newSize['<='] && body.length > newSize['<=']))
    ) {
      throw {
        mes: 'Check data size failed',
        expect: newSize,
        actual: body.length
      };
    }
  },

  contains: (code, headers, body, newBody) => {
    if (!utils.arrayContains(body, (!(newBody instanceof Array)) ? [newBody] : newBody)) {
      throw {
        mes: 'Check data contains failed'
      };
    }
  },

  equals: (code, headers, body, newBody) => {
    if (!utils.anyCompare(newBody, body)) {
      throw {
        mes: 'Check data equals failed'
      };
    }
  },

  in: (code, headers, body, newBody) => {
    if (!utils.arrayContains(body, (!(newBody instanceof Array)) ? [newBody] : newBody)) {
      throw {
        mes: 'Check data in failed'
      };
    }
  },

  "!contains": (code, headers, body, newBody) => {
    if (!utils.arrayNotContains(body, (!(newBody instanceof Array)) ? [newBody] : newBody)) {
      throw {
        mes: 'Check data not contains failed'
      };
    }
  },

  "!equals": (code, headers, body, newBody) => {
    if (utils.anyCompare(newBody, body)) {
      throw {
        mes: 'Check data not equals failed'
      };
    }
  },

  "!in": (code, headers, body, newBody) => {
    if (utils.arrayNotContains((!(newBody instanceof Array)) ? [newBody] : newBody)) {
      throw {
        mes: 'Check data not in failed'
      };
    }
  }

};