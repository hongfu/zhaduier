/*
 * @Author: hongfu
 * @Date: 2022-01-25 12:20:54
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-25 12:30:41
 * @Description: all framework support class file
 */

const Helpers = {
    DB: require('./DBHelper'),
    MQ: require('./Mq'),
    RD: require('./Redis'),
    serviceHelper:  require('./serviceHelper'),
};

module.exports = Helpers;
