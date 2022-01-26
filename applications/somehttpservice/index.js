/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:45:06
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 14:34:55
 * @Description: service entry file
 */

const debug = require('debug')('dev:' + __filename);

const { serviceHelper } = require('../../bootstrap/Helpers');

const app = new serviceHelper.HttpService(require('./config'));

const route = require('./router.js')

route(app);

module.exports = app