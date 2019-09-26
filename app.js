const Koa = require('koa');
const app = new Koa();

app.use((ctx) => {
    ctx.body = "hello, yueqi111"
});

app.listen(3000);