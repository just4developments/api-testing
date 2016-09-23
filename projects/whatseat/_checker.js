module.exports = {
  test: (code, headers, body, newStatus) => {
    throw {
      mes: 'test fail'
    };
  }
};