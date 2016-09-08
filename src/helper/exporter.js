var fs = require('fs');
var path = require('path'); 

module.exports = {
  toTestHtml: (config, fcDone, fcError) => {
    fs.readFile(path.join(__dirname, '..', 'template', 'test.result.html'), 'utf-8', function(err, data){
      if(err) return fcError(err);
      data = data.replace('$data', JSON.stringify(config));
      var fileOut = path.join(__dirname, '..', config.path, 'output', `${config.projectName}.result.html`);
      fs.writeFile(fileOut, data, function(err) {
        if(err) return fcError(err);
        fcDone(config, fileOut);
      }); 
    });
  },
  toDocHtml: (config, fcDone, fcError) => {
    fs.readFile(path.join(__dirname, '..', 'template', 'api.doc.html'), 'utf-8', function(err, data){
      if(err) return fcError(err);
      data = data.replace('$data', JSON.stringify(config));
      var fileOut = path.join(__dirname, '..', config.path, 'output', `${config.projectName}.doc.html`);
      fs.writeFile(fileOut, data, function(err) {
        if(err) return fcError(err);
        fcDone(config, fileOut);
      }); 
    });
  }
};