/*
 * @Author: hongfu
 * @Date: 2022-01-24 17:02:59
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 15:28:39
 * @Description: 扩展koa类,并加载环境配置
 */
!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':' + __filename);

const Koa = require('koa');

const {
    DB,
    MQ,
    RD
} = require('../vendor');

const FN = require('underscore')

/**
 * @description: 微服务koa扩展
 * @param {*}
 * @return {*}
 */
class KoaExt extends Koa {
    constructor(config) {
        super();

        this.context.config = config;//应用配置项
        
        config.serv_database_use && (this.context.db = new DB(config.serv_database));//数据库

        config.serv_mqtt_use && (this.context.mqtt = new MQ(config.serv_mqtt));//消息队列

        config.serv_redis_use && (this.context.redis = new RD(config.serv_redis));//redis

        config.serv_underscore_use && (this.context.FN = FN);//underscore
    }
}


module.exports = KoaExt