/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:45:06
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 16:09:58
 * @Description: service entry file
 */

const debug = require('debug')('dev:' + __filename);

const { HttpService } = require('../../bootstrap/services');

const config = require('./config');

const app = new HttpService(config);

require('./model.js')(app);//加载数据模型
require('./router.js')(app);//加载路由

const http = require('http');
const server = http.createServer(app.callback());

const WebSocket = require('ws');
const WebSocketApi = require('./ws');//引入ws请求处理
const wss = new WebSocket.Server({// 同一个端口监听不同的服务
    server
});

WebSocketApi(wss)

module.exports = {
    app: server,
    config: config
}