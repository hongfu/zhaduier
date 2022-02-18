/*
 * @Author: hongfu
 * @Date: 2022-02-18 15:54:57
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 17:08:37
 * @Description: websocket请求处理
 */
const debug = require('debug')('dev:' + __filename);

const wssApi = (wss) => {
    wss.on('connection', (ws)=>{
        ws.send('ws server catch you!');
        
        ws.on('message', (message)=>{
            debug('ws server received: %s', message.toString());
            ws.send('ws server got your message!');
        });
    });
}

module.exports = wssApi