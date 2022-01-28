/*
 * @Author: hongfu
 * @Date: 2022-01-28 12:24:55
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-28 12:25:45
 * @Description: services list file
 */

const debug = require('debug')('dev:' + __filename);

const services = [
    require('./somehttpservice')
]

module.exports = services