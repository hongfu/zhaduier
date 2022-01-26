/*
 * @Author: hongfu
 * @Date: 2022-01-24 16:47:13
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 14:03:29
 * @Description: service router file
 */
!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':xcx_nuochema_api_router')

const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    let app =  ctx.app;
    ctx.db.test();
    let res = new ctx.HttpResponse(200,'服务测试成功',{});
    ctx.body = JSON.stringify(res);
})

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods());
}