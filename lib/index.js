var Main = require('./handle/main');
var fs = require('fs');

module.exports = (projectName, mode) => {
  Main.mode = mode || 'test'; // test, debug, doc
  var files = fs.readdirSync(__dirname + '/../projects/');
  for (var name of files) {
    if (!projectName) {
      var m = name.match(/(.*?)\.default$/);
      if (m) projectName = m[1];
    }
  }
  if (!projectName) throw '# Not found project to run testcase';

  console.info(`############### PROJECT: ${projectName} ###############`);
  console.info('');
  var openWhenFinish = (fileOut, browser) => {
    var  open  =  require("open");
    open(fileOut, browser);
  };
  var main = new Main(`../projects/${projectName}`);
  var startTime = new Date().getTime();
  main.exec(mainConfig => {
    var exporter = require('./helper/exporter');
    if ('doc' === Main.mode) {
      main.getDoc(doc => {
        exporter.toDocHtml(doc, (config, fileOut) => {
          console.info(`\n\n***** Please see doc file in "${fileOut}"`);
          openWhenFinish(fileOut, mainConfig.browser);
        }, err => {
          console.error(err);
        });
      });
    } else {
      main.getTest(result => {
        result.duration = new Date().getTime() - startTime;
        exporter.toTestHtml(result, (config, fileOut) => {
          console.info(`\n\n***** Please see test result file in "${fileOut}"`);
          if ('debug' === Main.mode) {
            var emitter = require('./helper/emitter');
            emitter(main, () => {
              openWhenFinish(fileOut, mainConfig.browser);
            });
          } else {
            openWhenFinish(fileOut, mainConfig.browser);
          }
        }, err => {
          console.error(err);
        });
      });
    }
  });
}