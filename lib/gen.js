var copydir = require('copy-dir');
var path = require('path');

var projectName = process.argv[2];
if(!projectName) return console.error('You need add project name. \nExample: npm run gen "ProjectName"');
var fout = path.join(__dirname, '..', 'projects', projectName);
copydir(path.join(__dirname, 'template/temp-project'), fout, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log(`Generated successfully at "${fout}"`);
  }
});