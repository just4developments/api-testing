var Main = require('./handle/main');
var fs = require('fs');

global.action = process.argv[2];
var projectname = process.argv[3];

var files = fs.readdirSync(__dirname + '/../projects/');
for (var name of files){
  if(!projectname){
    var m = name.match(/(.*?)\.run$/);
    if(m) projectname = m[1]; 
  }
}
if(!projectname) throw '# Not found project to run testcase';

console.info(`############### PROJECT: ${projectname.replace('-default', '')} ###############`);
console.info('');
var main = new Main(`../projects/${projectname}`);
var startTime = new Date().getTime();
main.exec(config => {
  if('doc' === global.action){
    main.getDoc(doc => {
      doc.duration = new Date().getTime() - startTime;
      console.log(JSON.stringify(doc));
    });
  }else {
    config.duration = new Date().getTime() - startTime;
    var exporter = require('./helper/exporter');
    exporter(config);
  }
});