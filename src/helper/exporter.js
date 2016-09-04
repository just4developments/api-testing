var fs = require('fs');
var path = require('path'); 

module.exports = (config) => {
  fs.readFile(path.join(__dirname, '..', 'template', 'test.result.html'), 'utf-8', function(err, data){
    if(err) return console.error(err);
    data = data.replace('$data', JSON.stringify(config));
    var fileOut = path.join(__dirname, '..', config.path, 'output', 'test.result.html');
    fs.writeFile(fileOut, data, function(err) {
      if(err) return console.error(err);
      console.info(`\n\n***** Please see test result in "${fileOut}"`);
      var open = require("open");
      open(fileOut, config.browser);
    }); 
  });
};