/*
 * @Author: hongfu
 * @Date: 2022-01-24 17:02:59
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 15:59:48
 * @Description: service helper file 扩展koa类 支持json输出 
 */


!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':ApiHelper')

const Koa =  require('koa');
const KoaBody = require('koa-body');

const DB = require('./DBHelper');
const MQ = require('./Mq');
const RD = require('./Redis');

/**
 * 对koa的扩展
 */


/**
 * @description: 封装返回
 * @param {*} code 返回code
 * @param {*} message 信息
 * @param {*} result 数据
 * @return {*}
 */
 class HttpResponse extends Error{
    constructor(code,message,result){
        super()
        this.code = code
        this.message = message
        this.result = result
    }
}


/**
 * @description: 自定义错误信息
 * @param {*} message 信息提示
 * @param {*} url 请求路径
 * @param {*} path 文件路径
 * @param {*} error 错误
 * @return {*}
 */
class HttpError extends Error{
    constructor(message,url,path,error){
        super()
        this.message = message
        this.url = url
        this.path = path
        this.error = error
    }
}


/**
 * @description: http服务采用异常捕获方式处理输出和错误信息
 * @param {*} ctx
 * @param {*} next
 * @return {*}
 */
const KoaHandler = async (ctx, next) => {
    //请求开始时间
    const start = ctx.start_at_time = process.uptime()
    try {
        await next()
    } catch (error) {
        delete ctx.start_at_time
        if (error instanceof HttpResponse) {
            const e = {
                url: ctx.path,
                running: process.uptime()-start,
            }
            ctx.response.set("Content-Type", "application/json;charset=utf-8")
            ctx.response.body = {
                code: error.code,
                message: error.message,
                result: error.result,
                state: e
            }
        } else if (error instanceof HttpError) {
            debug(error)
        } else {
            throw error
        }
    }
}


/**
 * @description: 微服务koa扩展
 * @param {*}
 * @return {*}
 */
class KoaExt extends Koa{
    constructor(config){
        super();
        this.use(KoaHandler)//异常处理
        .use(KoaBody({ // 这里是为了将来扩展上传预留设置，如果不用对应插件可不设置
            multipart: false 
        }));
        this.context.config = config;
        this.context.HttpResponse = HttpResponse;
        this.context.HttpError = HttpError;
        this.context.db = new DB(config.serv_database);
        this.context.mqtt = new MQ(config.serv_mqtt);
        this.context.cache = new RD(config.serv_redis);
    }
}


module.exports = {
    HttpService: KoaExt,
}