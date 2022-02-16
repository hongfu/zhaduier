/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:45:06
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 12:37:59
 * @Description: service entry file
 */

const debug = require('debug')('dev:' + __filename);

const { HttpService } = require('../../bootstrap/services');

const app = new HttpService(require('./config'));

require('./model.js')(app);//加载数据模型
require('./router.js')(app);//加载路由

module.exports = app