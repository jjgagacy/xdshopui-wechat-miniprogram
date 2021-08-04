// 原生js来达到对象的扩展
function cloneObj(oldObj) { //复制对象方法 
  if (typeof (oldObj) != 'object') return oldObj;
  if (oldObj == null) return oldObj;
  var newObj = new Object();
  for (var i in oldObj)
    newObj[i] = cloneObj(oldObj[i]);
  return newObj;
};
function extendObj() { //扩展对象 
  var args = arguments;
  if (args.length < 2) return;
  var temp = cloneObj(args[0]); //调用复制对象方法 
  for (var n = 1; n < args.length; n++) {
    for (var i in args[n]) {
      temp[i] = args[n][i];
    }
  }
  return temp;
}

// 向外暴露接口
module.exports = {
  extendObj: extendObj
}