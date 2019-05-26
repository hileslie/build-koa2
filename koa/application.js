let http = require('http');
// http.createServer(function (request, response){
//   response.writeHead(200, {'Content-Type': 'text/plain'});
//   response.write("Hello World");
//   response.end();
// }).listen(8080, '127.0.0.1');
let context = require('./context');
let request = require('./request');
let response = require('./response');
// Koa是一个类
class Koa {
  constructor() {
    // 私有属性
    this.callbackFn;
    this.context = context;
    this.request = request;
    this.response = response;
  }
  use(cb) {
    this.callbackFn = cb; // 调用use方法的时候，将方法存到callbackFn中
  }
  // 创建上下文
  createContext(req, res) {
    let ctx = Object.create(this.context); // 希望ctx可以拿到context的属性，但是不修改context的属性
    ctx.request = Object.create(this.request);
    ctx.req = ctx.request.req = req; // 将原生的req也赋值到ctx上
    ctx.response = Object.create(this.response);
    ctx.res = ctx.response.res = res; // 将原生的res也赋值到ctx上
    return ctx;
  }
  // 处理请求
  handleRequest(req, res) {
    res.statusCode = 404; // 默认页面找不到
    let ctx = this.createContext(req, res);
    this.callbackFn(ctx); // 当回调函数执行后，ctx.body值就会发生变化
    let body = ctx.body;
    if (typeof body === 'undefined') {
      res.end('Not Found');
    } else if (typeof body === 'string') {
      res.end(body);
    }
  }
  // 监听端口时，启动服务
  listen() {
    // 创建服务
    let server = http.createServer(this.handleRequest.bind(this)); // handleRequest绑定当前Koa作用域，handleRequest中的this就指向了Koa
    server.listen(...arguments);
  }
}

module.exports = Koa;