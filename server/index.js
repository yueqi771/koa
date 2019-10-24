const Koa = require('koa');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const koaBody = require('koa-body');
const KoaStatic = require('koa-static');
const path = require('path');
const mongoose = require('mongoose');

const config = require('./config');
const registerRoute = require('./routers');

const app = new Koa();

mongoose.connect(config.connectionStr, () => {
    console.log('db链接成功了');
});

mongoose.connection.on('error', console.error)

app.use(KoaStatic(path.join(__dirname, 'public')))

app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, 'public/uploads'),
        keepExtensions: true,
        multipart:true,
        maxFileSize: 2000*1024*1024
    }
}))

app.use(parameter(app));

registerRoute(app);

app.listen(80, () => console.log('server is listening on 80'));
