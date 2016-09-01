var Main = require('./handle/main');
var fs = require('fs');

global.action = process.argv[2];
var projectname = process.argv[3];

var files = fs.readdirSync(__dirname + '/../testcases/');
for (var name of files){  
  if(!projectname && name.indexOf('-project-default') !== -1){
    projectname = name;
    break;
  }else if(projectname && (`${projectname}-project-default` === name || `${projectname}-project` === name)){
    projectname = name;
  }
}
if(!projectname) throw '# Not found project to run testcase';

console.info(`############### PROJECT: ${projectname.replace('-default', '')} ###############`);
console.info('');
var main = new Main(`../testcases/${projectname}`);
main.exec(config => {
  if('doc' === global.action){
    main.getDoc(doc => {
      console.log(JSON.stringify(doc));
    });
  }else {
    console.log(JSON.stringify(config));
  }
});