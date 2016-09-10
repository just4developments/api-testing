module.exports = {
  test: (code, headers, body, newStatus) => { // Declare customize your checker. You can use in api by add checker {test: 'Your value'}
    // throw error when your checking fail
    throw {
      mes: 'test fail'
    };
  }
}