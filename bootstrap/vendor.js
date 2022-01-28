/*
 * @Author: hongfu
 * @Date: 2022-01-25 12:20:54
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-28 12:41:37
 * @Description: all framework support class file
 */
!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':' + __filename)

const Helpers = {
    DB: require('./vendor/DBHelper'),
    MQ: require('./vendor/MqHelper'),
    RD: require('./vendor/RedisHelper'),
};

module.exports = Helpers;
