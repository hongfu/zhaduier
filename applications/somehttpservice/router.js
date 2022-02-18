/*
 * @Author: hongfu
 * @Date: 2022-01-24 16:47:13
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 13:31:17
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
    //测试数据模型
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
    //测试生产
    let mq = ctx.mqtt
    let res = await mq.send('a1','at:content data',async ()=>{
        return JSON.stringify({errcode:0,msg:'mqtt生产测试成功',data:{chanel:'a1',data:'at:content data'}});
    })
    ctx.body = res
})

router.get('/mqtt/receive', async (ctx, next) => {
    //测试消费
    let mq = ctx.mqtt
    const consumer1 = async (d)=>{
        debug('consumer1 got:',d)
    }
    const consumer2 = async (d)=>{
        debug('consumer2 got:',d)
    }
    
    await mq.receive('a1',consumer1)
    await mq.receive('a1',consumer2)
    ctx.body = JSON.stringify({errcode:0,msg:'mqtt消费添加成功',data:{chanel:'a1'}});;
})

router.get('/mqtt/publish', async (ctx, next) => {
    //测试发布
    let mq = ctx.mqtt
    let res = await mq.publish('testEx','test.group1.user1','publish content1', async ()=>{
        return JSON.stringify({errcode:0,msg:'mqtt发布测试成功',data:{chanel:'a1',data:'publish content1'}});
    })
    ctx.body = res;
})

router.get('/mqtt/subscribe', async (ctx, next) => {
    //测试订阅
    let mq = ctx.mqtt
    const subscriber1 = async (d)=>{
        debug('subscriber1 got:',d)
    }
    const subscriber2 = async (d)=>{
        debug('subscriber2 got:',d)
    }

    await mq.subscribe('testEx','testQue1','test.#',subscriber1)
    await mq.subscribe('testEx','testQue2','test.#',subscriber2)

    ctx.body = JSON.stringify({errcode:0,msg:'mqtt订阅添加成功',data:{}});;
})

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods());
}