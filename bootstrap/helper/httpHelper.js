/*
 * @Author: hongfu
 * @Date: 2022-01-24 17:02:59
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 12:11:10
 * @Description: service helper file 扩展koa类 支持json输出 
 */
!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':' + __filename);

const Koa = require('koa');
const KoaBody = require('koa-body');

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
        
        this.use(KoaBody({ // 这里是为了将来扩展上传预留设置，如果不用对应插件可不设置
                multipart: false
            }));

        this.context.config = config;//应用配置项
        
        if(config.serv_database_use){
            this.context.db = new DB(config.serv_database);//orm
            this.context.models = {};//数据模型
        }
        config.serv_mqtt_use && (this.context.mqtt = new MQ(config.serv_mqtt));//消息队列

        config.serv_redis_use && (this.context.redis = new RD(config.serv_redis));//redis可做缓存

        config.serv_underscore_use && (this.context.FN = FN);//引入underscore
    }
}


module.exports = KoaExt