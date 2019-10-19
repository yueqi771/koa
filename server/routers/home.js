const Router = require('koa-router');
const router = new Router();
const { index, upload, viewNode } = require('../controllers/home')

router.get('/', index);
router.post('/upload', upload);
router.get('/homeView', viewNode)

module.exports = router