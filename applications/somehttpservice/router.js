/*
 * @Author: hongfu
 * @Date: 2022-01-24 16:47:13
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 14:12:54
 * @Description: service router file
 */
const debug = require('debug')('dev:' + __filename);

const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    //测试本地配置是否生效
    // ctx.mqtt.test();
    //ctx.db.test();
    // ctx.redis.test();

    let [r,m] = await ctx.db.getConn().query("select * from users")
    
    let res = {code:200,msg:'服务测试成功',data:r};
    ctx.body = JSON.stringify(res);
})

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods());
}