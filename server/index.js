const Koa = require('koa');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const path = require('path');
const mongoose = require('mongoose');

const config = require('./config');
const registerRoute = require('./routes');

const app = new Koa();

mongoose.connect(config.connectionStr, () => {
    console.log('db链接成功了');
});

mongoose.connection.on('error', console.error)

app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));

app.use(parameter(app));

registerRoute(app);

app.listen(3000, () => console.log('server is listening on 3000'));
