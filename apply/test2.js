let Koa = require('../koa/application');

let app = new Koa();

app.use((ctx) => {
    ctx.body = 'hello leslie2'
});

app.listen(3000);