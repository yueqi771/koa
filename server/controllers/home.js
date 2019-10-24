const path = require('path');
const fs = require('fs')
const ApiSpeechClient = require('baidu-aip-sdk').speech;
var softwareSdk = require("microsoft-cognitiveservices-speech-sdk");

class HomeController {

    constructor() {

    }
    
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
        const result = await speechInstanct.recognize(buffer, 'pcm', 16000, {
            dev_pid: 1737, 
            cuid: '88:e9:fe:75:a7:d3'
        })
        console.log('return json: ' + JSON.stringify(result));
        console.log('在线语音识别结果: ' + result.result);

        // ctx.setHeader('Content-Type', 'application/json;charset=utf-8');
        ctx.body = {
            result: result
        }

        
    }

    async softwareRecognition(ctx) {
        const file = ctx.request.files.file;
        const basename = path.basename(file.path);

        const subscriptionKey = "159c72c78c4646979b1ad799c4f03fce";
        const serviceRegion = "westus"; // e.g., "westus"
        const filename = "YourAudioFile.wav"; // 16000 Hz, Mono
        const pushStream = softwareSdk.AudioInputStream.createPushStream();

        const reader = fs.createReadStream(file.path);
        

        function streamToBuffer(stream) {
            return new Promise((resolve, reject) => {
                let buffers = [];
                stream.on('data', (arrayBuffer) => {
                    pushStream.write(arrayBuffer.slice());
                    buffers.push(arrayBuffer)
                })
                stream.on('end', () => {
                    const bufferData = Buffer.concat(buffers)
                    pushStream.close();
                    resolve(bufferData)
                    return bufferData
                })
            });
        }

        const buffer = await streamToBuffer(reader);

      
        // we are done with the setup
        console.log("Now recognizing from: " + basename);
        
        // now create the audio-config pointing to our stream and
        // the speech config specifying the language.
        var audioConfig = softwareSdk.AudioConfig.fromStreamInput(pushStream);
        var speechConfig = softwareSdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
          
        // setting the recognition language to English.
        speechConfig.speechRecognitionLanguage = "en-US";

        let result1 ;
        
        // create the speech recognizer.
        var recognizer = new softwareSdk.SpeechRecognizer(speechConfig, audioConfig);
        
        // start the recognizer and wait for a result.
        const result = await softwareRecognize(recognizer)

        console.log('识别wanchengle ')

        ctx.body = {
            code: 10000,
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
    });
}

function softwareRecognize(instance) {
    return new Promise((resolve, reject) => {
        instance.recognizeOnceAsync(
        function (result) {
            console.log(result);
            instance.close();
            instance = undefined;
            resolve(result)
        },
        function (err) {
            console.trace("err - " + err);
        
            instance.close();
            instance = undefined;
            reject(err)
        });
    })
}