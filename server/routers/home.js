const Router = require('koa-router');
const router = new Router();
const { index, upload, viewNode, softwareRecognition } = require('../controllers/home')

router.get('/', index);
router.post('/upload', upload);
router.post('/recognition', softwareRecognition);
router.get('/homeView', viewNode);

module.exports = router