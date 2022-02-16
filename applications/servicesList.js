/*
 * @Author: hongfu
 * @Date: 2022-01-28 12:24:55
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 12:12:24
 * @Description: services list file
 */

const debug = require('debug')('dev:' + __filename);

const services = [
    require('./somehttpservice'), //框架演示的httpservice
    require('./ncm')//我自己当前的开发,可以注释掉
]

module.exports = services