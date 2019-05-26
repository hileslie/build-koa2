let url = require('url');
let request = {
  // 利用get定义，可方便拓展
  get url() {
    return this.req.url; // 经过创建上下文之后，this指向ctx.request，ctx也会代理ctx.request上的属性
  },
  get path() {
    return url.parse(this.req.url).pathname;
  }
};
module.exports = request;
