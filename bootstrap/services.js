/*
 * @Author: hongfu
 * @Date: 2022-01-28 12:19:53
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 15:50:14
 * @Description: services file
 */

!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':' + __filename)

const services = {
    HttpService: require('./helper/httpHelper'),
}

module.exports = services