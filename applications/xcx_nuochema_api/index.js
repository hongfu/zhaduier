/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:45:06
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-25 12:44:11
 * @Description: nuochema entry file
 */
!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':xcx_nuochema_api')

const { serviceHelper } = require('../../bootstrap/Helpers');

const app = new serviceHelper.HttpService(require('./config'));

const route = require('./router.js')

route(app);

module.exports = app