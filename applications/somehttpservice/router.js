/*
 * @Author: hongfu
 * @Date: 2022-01-24 16:47:13
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 12:11:46
 * @Description: service router file
 */
const debug = require('debug')('dev:' + __filename);

const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    //测试本地配置是否生效
    ctx.mqtt.test();
    let db = ctx.db;
    db.test();
    ctx.redis.test();
    
    let res = new ctx.HttpResponse(200,'服务测试成功',ctx.config);
    ctx.body = JSON.stringify(res);
})

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods());
}