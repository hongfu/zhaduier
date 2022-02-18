/*
 * @Author: hongfu
 * @Date: 2022-01-28 12:24:55
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 15:50:37
 * @Description: services list file
 */

const debug = require('debug')('dev:' + __filename);

const services = [
    require('./somehttpservice'), //框架演示的httpservice
]

module.exports = services