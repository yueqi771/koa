const path = require('path');
const fs = require('fs')
const ApiSpeechClient = require('baidu-aip-sdk').speech;

class HomeController {
    
    index(ctx) {
        ctx.body = "<h1>这里是越祈的主页</h1>"
    }

    async upload(ctx) {
        const file = ctx.request.files.file;
        const basename = path.basename(file.path);

        const APP_ID = '17564900';
        const API_KEY = 'X8G1X9ns45N9nwVakfbkRAH1';
        const SECRET_KEY = 'y2yBibLtTeLZYYd6yIgLeFniIqfpq4gg';

        // 语音识别实例
        const speechInstanct = new ApiSpeechClient(APP_ID, API_KEY, SECRET_KEY);

        // 创建可读流
        const reader = fs.createReadStream(file.path);
        const buffer = await streamToBuffer(reader)

        console.log('开始识别')    

        /** */
        const result = await speechInstanct.recognize(buffer, 'wav', 16000)
        console.log('return json: ' + JSON.stringify(result));
        console.log('在线语音识别结果: ' + result.result);

        // ctx.setHeader('Content-Type', 'application/json;charset=utf-8');
        ctx.body = {
            result: result
        }

        
    }

    viewNode(ctx) {
        const html = fs.readFileSync(path.join(__dirname, '../views/home_node.html'), 'utf-8')
        ctx.response.type = 'html';

        ctx.body = html
    }

    
}

module.exports = new HomeController()

// 将上传文件转化为buffer格式
function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        let buffers = [];
        stream.on('data', (data) => buffers.push(data))
        stream.on('end', () => {
            const bufferData = Buffer.concat(buffers)
            resolve(bufferData)
            return bufferData
        })
    }, err => {
        reject(err)
    });
}