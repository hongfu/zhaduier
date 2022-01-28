/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:45:06
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-28 12:44:59
 * @Description: service entry file
 */

const debug = require('debug')('dev:' + __filename);

const { HttpService } = require('../../bootstrap/services');

const app = new HttpService(require('./config'));

const route = require('./router.js')

route(app);

module.exports = app