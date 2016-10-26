var unirest = require('unirest');

exports = module.exports = {
  now: (...ticks) => {
    if (ticks.length === 0) {
      return new Date();
    }
    if (ticks.length > 1) {
      return new Date(ticks);
    }
    var now = new Date();
    return new Date(now.getTime() + ticks[0]);
  },
  hash: {
    base64: {
      encode: (str) => {
        return new Buffer(str).toString('base64');
      },
      decode: (str, charset = "utf8") => {
        return new Buffer(str, 'base64').toString(charset);
      }
    },
    md5: (str) => {
      return require('crypto').createHash('md5').update(str).digest('hex');
    }
  }

}