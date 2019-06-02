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
    this.context = context;
    this.request = request;
    this.response = response;
    this.middlewares = []; // 多个中间件
  }
  use(cb) {
    this.middlewares.push(cb);
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
  // 组合
  compose(ctx, middlewares) {
    function dispatch(index) {
      // 执行到最后一个中间件时，直接返回，执行完毕
      if (index === middlewares.length) return Promise.resolve();
      let middleware = middlewares[index];
      // 递归创建嵌套的promise，每个promise必须等待内部promise执行完毕后，再执行
      return Promise.resolve(middleware(ctx, () => dispatch(index + 1)));
    }
    return dispatch(0);
  }
  // 处理请求
  handleRequest(req, res) {
    res.statusCode = 404; // 默认页面找不到
    let ctx = this.createContext(req, res);
    // 当回调函数执行后，ctx.body值就会发生变化
    let composeMiddleware = this.compose(ctx, this.middlewares);
    // 当此promise执行完成之后，再执行res.end()
    composeMiddleware.then(() => {
      let body = ctx.body;
      if (typeof body === 'undefined') {
        res.end('Not Found');
      } else if (typeof body === 'string') {
        res.end(body);
      }
    });
  }
  // 监听端口时，启动服务
  listen() {
    // 创建服务
    let server = http.createServer(this.handleRequest.bind(this)); // handleRequest绑定当前Koa作用域，handleRequest中的this就指向了Koa
    server.listen(...arguments);
  }
}

module.exports = Koa;