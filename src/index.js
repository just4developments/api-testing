var Main = require('./handle/main');
var fs = require('fs');

global.action = process.argv[2];
var projectname = process.argv[3];

var files = fs.readdirSync(__dirname + '/../projects/');
for (var name of files){
  if(!projectname){
    var m = name.match(/(.*?)\.default$/);
    if(m) projectname = m[1]; 
  }
}
if(!projectname) throw '# Not found project to run testcase';

console.info(`############### PROJECT: ${projectname} ###############`);
console.info('');
var openWhenFinish = (fileOut, browser) => {
  var open = require("open");
  open(fileOut, browser);
};
var main = new Main(`../projects/${projectname}`);
var startTime = new Date().getTime();
main.exec(mainConfig => {
  var exporter = require('./helper/exporter');
  if('doc' === global.action){
    main.getDoc(doc => {
      exporter.toDocHtml(doc, (config, fileOut) => {
        console.info(`\n\n***** Please see doc file in "${fileOut}"`);
        openWhenFinish(fileOut, mainConfig.browser);
      });
    });
  }else {
    main.getTest(result => {
      result.duration = new Date().getTime() - startTime;
      exporter.toTestHtml(result, (config, fileOut) => {
        console.info(`\n\n***** Please see test result file in "${fileOut}"`);
        if('debug' === global.action){
          var emitter = require('./helper/emitter');
          emitter(main, () => {
            openWhenFinish(fileOut, mainConfig.browser);
          });
        }else{
          openWhenFinish(fileOut, mainConfig.browser);
        }
      });
    });    
  }
});