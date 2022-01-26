/*
 * @Author: hongfu
 * @Date: 2022-01-24 16:47:13
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 14:35:52
 * @Description: service router file
 */

const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    let res = new ctx.HttpResponse(200,'服务测试成功',{});
    ctx.body = JSON.stringify(res);
})

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods());
}