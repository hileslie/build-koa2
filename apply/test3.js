let Koa = require('../koa/application');
let app = new Koa();
let log = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('ok');
      resolve();
    }, 1000);
  })
}
app.use(async (ctx, next) => {
    console.log(1);
    await next();
    console.log(2);
});
app.use(async (ctx, next) => {
    console.log(3);
    await log();
    await next();
    console.log(4);
});
app.use((ctx, next) => {
    console.log(5);
    next();
    console.log(6);
});
app.listen(3000);