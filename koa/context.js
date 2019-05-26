let proto = {

};
// 当调用proto.url，返回request.url
function defineGetter(property, name) {
  // 自定义获取器（代理），给proto对象添加一个为name的属性
  proto.__defineGetter__(name, function() {
    return this[property][name];
  })
}
defineGetter('request', 'url'); // 将request的url属性代理给proto，相当于proto.url = proto.request.url;
defineGetter('request', 'path'); // 将request的path属性代理给proto
defineGetter('response', 'body'); // 将response的body属性代理给proto

function defineSetter(property, name) {
  // 自定义设置器
  proto.__defineSetter__(name, function(value) {
    this[property][name] = value;
  })
}
defineSetter('response', 'body'); // 将response的body属性代理给proto
module.exports = proto;
