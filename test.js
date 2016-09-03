var doc = require('./testcases/test-project-default/_doc');

var getType = (value)=>{
  if(typeof value === 'number'){
    if(value %2 === 0) return 'integer';
    return 'float';
  }
  return typeof value;
}
var getDocFromObject = (doc, item) => {
  var d = {};
  if(item instanceof Array){
    d = {type: 'array', des: doc['#'], data: {}};
    if(item.length > 0){
      for(var i in item[0]){
        d.data[i] = getDocFromObject(doc[i], item[0][i]);
      }
    }
  }else if(item instanceof Object){
    d = {type: 'object', des: doc['#'], data: {}};
    for(var i in item){
      d.data[i] = getDocFromObject(doc[i], item[i]);
    }
  }else{
    d = {des: doc, type: getType(item) };
  }
  return d;
}
var c = getDocFromObject(doc.describe.test, {
  a: 10,
  b: [{
    c: 1.5,
    d: 1000
  }]
});
console.log(c);
