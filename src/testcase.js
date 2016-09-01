var Api = require('./api');

module.exports = class Testcase {

  constructor(config){
    this.config = config;
  }

  exec(){
    for(var i in this.config.apis){      
      var api = new Api(this.config.apis[i]);
      api.exec();
    }
  }

}