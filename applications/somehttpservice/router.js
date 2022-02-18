/*
 * @Author: hongfu
 * @Date: 2022-01-24 16:47:13
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 10:40:09
 * @Description: service router file
 */
const debug = require('debug')('dev:' + __filename);

const router = require('koa-router')();

router.get('/', async (ctx, next) => {
    ctx.body = 'zhaduier，测试服务启动:)';
})

router.get('/database', async (ctx, next) => {
    //测试数据库
    let db = ctx.db.getConn()
    let [r,m] = await db.query("select * from users")
    let res = {errcode:0,msg:'数据库测试成功',data:r};
    ctx.body = JSON.stringify(res);
})

router.get('/models', async (ctx, next) => {
    //测试模型
    let db = ctx.db.getConn()
    let r = await db.models.users.findAll();
    let res = {errcode:0,msg:'数据模型users测试成功',data:r};
    ctx.body = JSON.stringify(res);
})

router.get('/redis', async (ctx, next) => {
    //测试内存缓存
    let r = {}
    let res = ''
    let rd = ctx.redis
    
    r = await rd.set('aak',{data:'aav'})
    r=='OK' && (res += JSON.stringify({errcode:0,msg:'cache写入测试成功',data:r}));
    r = await rd.get('aak')
    r=='{\"data\":\"aav\"}' && (res += JSON.stringify({errcode:0,msg:'cache读取测试成功',data:r}));
    r = await rd.cancel('aak',0)
    r = await rd.get('aak')
    r==null && (res += JSON.stringify({errcode:0,msg:'cache过期测试成功',data:r}));

    ctx.body = res;
})

router.get('/mqtt/send', async (ctx, next) => {
    //测试mq
    let res = ''
    let mq = ctx.mqtt
    let r
    //publish
    r = await mq.send('a1','at:content data',async ()=>{
        res += JSON.stringify({errcode:0,msg:'mqtt发布测试成功',data:{chanel:'a1',data:'at:content data'}});
        return;
    })
    ctx.body = res
})

router.get('/mqtt/receive', async (ctx, next) => {
    //测试mq
    let res = ''
    let mq = ctx.mqtt
    let r
    //subscribe
    await mq.receive('a1',(data)=>{
        res += JSON.stringify({errcode:0,msg:'mqtt订阅测试成功',data: {chanel:'a1',data:data}});
    })
    ctx.body = res;
})

router.get('/mqtt/watch', async (ctx, next) => {
    //测试mq
    let res = ''
    let mq = ctx.mqtt
    let queueName = 'a1'
    //listener
    let cb = (data)=>{
        console.log('监视'+queueName+'频道并获得：',data)
    }
    mq.bindListener(queueName,cb)
    mq.watch()

    ctx.body = res;
})

router.get('/mqtt/stopwatch', async (ctx, next) => {
    //测试mq
    let res = ''
    let mq = ctx.mqtt
    mq.stopWatch()

    ctx.body = res;
})

router.get('/mqtt/stopwatch/:queue', async (ctx, next) => {
    //测试mq
    const { queue } = ctx.params
    let res = ''
    let mq = ctx.mqtt
    mq.stopWatch(queue)

    ctx.body = res;
})

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods());
}