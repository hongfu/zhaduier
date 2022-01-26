/*
 * @Author: hongfu
 * @Date: 2022-01-24 16:47:13
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-25 14:36:43
 * @Description: nuochema router file
 */
!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':xcx_nuochema_api_router')

const KoaRouter = require('koa-router');

//加入路径版本区分
const router = new KoaRouter();//暂无路径版本区分
// const router = new KoaRouter({
//     prefix: process.env.xcx_nuochema_api.serv_prefix + '-' + process.env.xcx_nuochema_api.serv_version,
// });

router.get('/', async (ctx, next) => {
    let app =  ctx.app;
    ctx.db.test();
    let res = new ctx.HttpResponse(200,'haha',app);
    ctx.body = JSON.stringify(res);
})

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods());
}