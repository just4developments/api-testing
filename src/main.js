global.var = {};

const TestCase = require('./testcase');

module.exports = class Main {
    
    constructor(config){
      this.config = config;
      for(var i in this.config.testcases){
        this.config.testcases[i] = require('../testcases/'+this.config.testcases[i]);        
      }
    }

    exec(){
      for(var i in this.config.testcases){        
        var tc = new TestCase(this.config.testcases[i]);
        tc.exec();
      }
    }
}