const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router({
    prefix: '/users'
});

// 多中间键用法
const auth = async (ctx, next) => {
    if(ctx.url !== '/users') {
        ctx.throw(401);
    } 

    await next();
}

router.get('/', auth, (ctx) => {
    ctx.body = `这里是用户列表页`
})

router.get('/:id', auth, (ctx) => {
    ctx.body = `这里是用户列表页${ctx.params.id}`
})

router.post('/', auth, (ctx) => {
    ctx.body = "这是创建用户"
})

app.use(router.routes());
// 所有的接口支持options请求
app.use(router.allowedMethods());

app.listen(3000, '0.0.0.0', () => {
    console.log('server is listenint on 3000')
});