/*
 * @Author: hongfu
 * @Date: 2022-01-23 10:03:23
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-23 11:48:02
 * @Description: 全局中间件
 */
const { Debug,KoaBody, Exp, Bxp, Config } = require('../inc')
cache = require('../utils/Cache.js')

const debug = Debug('dev:middle-index');

const handler = async (ctx, next) => {
    //请求开始时间
    const start = ctx.start_at_time = process.uptime()
    try {
        await next()
    } catch (error) {
        delete ctx.start_at_time
        if (error instanceof Exp) {
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
        } else if (error instanceof Bxp) {
            debug('BXP:-------------message--------------//  ' + error.message)
            debug('BXP:-------------url------------------//  ' + error.url)
            debug('BXP:-------------dest-----------------//  ' + error.path)
            debug('BXP:-------------error----------------//  ')
            debug(error.error)
        } else {
            throw error
        }
    }
}


var customCtx = async function (ctx, next) {
    class Swap {
        push(key, value) {
            this[key] = value;
        }
        get(key) {
            let ret;
            key
                ? ret = this[key]
                : ret = this
            return ret;
        }
        pop(key) {
            let ret;
            key
                ? ret = JSON.parse(JSON.stringify(this[key]))
                : ret = JSON.parse(JSON.stringify(this))
            key
                ? delete this[key]
                : this.clear()
            return ret;
        }
        clear() {
            for (let i = 0; i < Object.keys(this).length; i++) {
                delete this[Object.keys(this)[i]];
            }
        }
        out(key) {
            let res
            key
                ? res = this.pop(key)
                : res = this.pop()
            throw new Exp(res.code,res.message,res.result)
        }
        debug(key) {
            ctx.set("Content-Type", "application/json; charset=utf-8")
            key
                ? ctx.response.body = ctx.state[key]
                : ctx.response.body = ctx.state
        }
    }


    // 允许来自所有域名请求
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
    ctx.set("Access-Control-Allow-Credentials", true);
    ctx.set("Access-Control-Max-Age", 300);
    ctx.state = new Swap

    await next();//运行完毕，交给下一个中间件
}

const cachedb = async (ctx, next) => {
    let cachedata=null
    cachedata = await cache.get(ctx.request)
    ctx.cache_db_data = cachedata

    await next();//运行完毕，交给下一个中间件
}



var load = (app) => {

    app.use(handler)//异常处理
        .use(KoaBody({ multipart: false }))//请求头
        .use(customCtx)//跨域和交换区

    Config.app.cacheOpen && app.use(cachedb)//数据缓存


    // app.use(views(__dirname + '/views', {
    //   extension: 'view'
    // })) 

    //error-handling
    app.on('error', (err, ctx) => {
        debug('服务异常---Error')
        debug(err)
        // debug('服务错误--------Context')
        // debug(ctx)
    });

}

module.exports = load