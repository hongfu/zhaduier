/*
 * @Author: hongfu
 * @Date: 2022-01-23 10:03:24
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-23 11:49:45
 * @Description: 请求处理
 */

const { Path, KoaSend, KoaRouter, Exp, Config } = require('./inc')
const orm = require('./utils/Orm'), net = require('./utils/Net'), tool = require('./utils/Files')


const router = new KoaRouter({
    prefix: Config.app.server_prefix
})

//测试
router.post('/test', async (ctx, next) => {
    ctx.state.push('test', { code: 1, message: '成功', result: ctx.request })
    ctx.state.out('test')
})
router.get('/test', async (ctx, next) => {
    ctx.state.push('test', { code: 1, message: '成功', result: ctx.request })
    ctx.state.out('test')
})

router.post('/test/pgdata', async (ctx, next) => {
    let ret  = [
        {
            node: 'element',
            tag: 'view',
            class: ['a b'],
            content: '',
            child: [
                {
                    node: 'element',
                    tag: 'view',
                    class: ['a b'],
                    content:'',
                },
                {
                    node: 'element',
                    tag: 'text',
                    class: ['a b'],
                    content: "text标签",
                    child: [
                        {
                            node: 'element',
                            tag: 'text',
                            class: ['a b'],
                            content: "嵌套text标签"
                        }
                    ]
                },
                {
                    node: 'element',
                    tag: 'view',
                    content: 'view标签',
                },
            ]
        }
    ]
    throw new Exp(1,'ok', ret)
})

router.post('/test/createappinfo',
    async (ctx, next) => {
        let rows = await orm.appinfoInsert({
            title: '二旧',
            motto: `我处理旧物时的尴尬:
                咸鱼太乱；
                转转，没回应；
                邻居群，很快就被刷屏掉。

                只好求自己来弄一个
                别被刷屏，编辑简单，
                功能简洁的小程序。`
        });
        rows.length > 0
            ? ctx.state.push('appinfo', { code: 1, message: 'appinfo创建成功', result: rows })
            : ctx.state.push('appinfo', { code: -1, message: 'appinfo创建失败', result: [] })
        ctx.state.out()
    })

router.post('/test/findyaoqingma',
    async (ctx, next) => {
        let rows = await orm.yaoqingFind(ctx.request.body.yaoqing);
        rows.length > 0
            ? ctx.state.push('yaoqingma', { code: 1, message: '邀请码查询成功', result: rows })
            : ctx.state.push('yaoqingma', { code: -1, message: '邀请码查询失败', result: [] })
        ctx.state.out()
    })

//index
router.post('/app', async (ctx, next) => {
    let rows = await orm.appinfoFind()

    if (rows.length > 0) {
        let ret = new Exp(1, '小程序信息查询成功', rows)
        Config.app.cacheOpen && cache.set(ctx.request, ret).then(cache.expire(ctx.request, 1800))
        ctx.set('Cache-Control', 'max-age=86400')
        throw ret
    } else {
        throw new Exp(-1, '小程序信息查询失败', [])
    }
})

//static
router.get(Config.app.server_static + ':filename', async (ctx, next) => {
    const { filename } = ctx.params

    if (await tool.isExist(Path.join(Config.path.static, filename))) {
        ctx.set('Cache-Control', 'max-age=172800')//开启图片静态缓存2Day
        await KoaSend(ctx, Path.join(Config.path.static, filename), { root: '/' })
    } else {
        throw new Exp(0, '文件不存在', [])
    }

});

//init
router.post('/init',
    async (ctx, next) => {
        let ret = await orm.databaseInit();
        ret = await orm.yaoqingInsert(123321);
        ret = await orm.appinfoInsert({
            title: '二旧',
            motto: `我处理旧物时的尴尬:
            咸鱼太乱；
            转转，没回应；
            邻居群，很快就被刷屏掉。

            只好求自己来弄一个
            别被刷屏，编辑简单，
            功能简洁的小程序。` 
        })
        if (ret) {
            throw new Exp(1, '初始化数据库成功', [ret])
        } else {
            throw new Exp(1, '初始化数据库失败', [])
        }
    })

router.post('/uploadimg',
    require('./middleware/upload.js'),
    async (ctx, next) => {
        let files = [ctx.request.files[Object.getOwnPropertyNames(ctx.request.files)[0]]]
        // 图片压缩
        let ret = tool.imgZip(files);
        if (files.length > 0) {
            throw new Exp(1, '上传成功', files)
        } else {
            throw new Exp(-1, '上传失败', [])
        }
    }

)

//user
// router.post('/user/register',
//     async (ctx, next) => {
//         let rows = await orm.userInsert(ctx.request.body);
//         rows.length > 0
//             ? ctx.state.push('register', { code: 1, message: '插入用户成功', result: rows })
//             : ctx.state.push('register', { code: -1, message: '插入用户失败', result: [] })
//         ctx.state.out()
//     })

router.post('/user/wxregister',
    async (ctx, next) => {
        let yaoqing = 123321
        let rows = await orm.yaoqingFind(yaoqing);
        if (rows.length === 0) throw new Exp(-1, '邀请码查询失败', rows)
        const { code, nick_name, avatar_url, gender } = ctx.request.body
        ctx.request.body.jiuma ? rows = await net.wxGetOpenid(code,Config.app.appid1,Config.app.AppSecret1) : rows = await net.wxGetOpenid(code,Config.app.appid,Config.app.AppSecret);
        if (rows.length === 0) throw new Exp(-1, 'weixin回调失败', rows)
        const { session_key, openid } = rows
        let usr = {
            token: session_key,
            username: nick_name,
            password: openid,
            nick_name: nick_name,
            avatar_url: avatar_url,
            gender: gender
        }
        rows = await orm.userUpdate(usr);
        if (rows.length === 0) throw new Exp(-1, '生成新用户失败', rows)
        const {userid} = rows[0]
        throw new Exp(1, '用户更新成功', [{
            token: session_key,
            userid: userid,
            nick_name: nick_name,
            avatar_url: avatar_url,
            gender: gender
        }])
    })

router.post('/user/tklogin',
    async (ctx, next) => {
        const { token } = ctx.request.body
        rows = await orm.tokenFind(token);
        if (rows.length === 0) throw new Exp(-1, 'token无效', rows)
        const { userid } = rows[0]
        rows = await orm.userByUserid(userid);
        if (rows.length === 0) throw new Exp(-1, '用户不存在', rows)
        const { nick_name, avatar_url, gender } = rows[0]
        // rows = await orm.tokenInsert(crypt(), userid);
        // if (rows.length === 0) throw new Exp(-1, 'token写入失败', rows)
        throw new Exp(1, '用户登录成功', [{
            token: token,
            userid: userid,
            nick_name: nick_name,
            avatar_url: avatar_url,
            gender: gender
        }])

    })

// router.post('/user/wxlogin',
//     async (ctx, next) => {
//         const {code} = ctx.request.body
//         let rows = await net.wxGetOpenid(code);
//         if (rows.length === 0) throw new Exp(-1, 'weixin回调失败', rows)
//         console.log(rows)
//         const { session_key, openid } = rows
//         rows = await orm.userByOpenid(openid);
//         if (rows.length === 0) throw new Exp(-1, '用户不存在', rows)
//         const { userid, nick_name, avatar_url, gender } = rows[0]
//         rows = await orm.tokenInsert(session_key, userid);
//         if (rows.length === 0) throw new Exp(-1, 'token写入失败', rows)
//         ctx.state.push('wxlogin', {
//             code: 1, message: '用户登录成功', result: [{
//                 token: rows[0].token,
//                 nick_name: nick_name,
//                 avatar_url: avatar_url,
//                 gender: gender
//             }]
//         })
//         ctx.state.out('wxlogin')
//     })

//info
router.post('/info/insert',
    async (ctx, next) => {
        const { token, kouling } = ctx.request.body
        let rows = await orm.yaoqingFind(kouling);
        if (rows.length === 0) throw new Exp(-1, '口令错误', rows)
        rows = await orm.tokenFind(token);
        if (rows.length === 0) throw new Exp(-1, 'token无效', rows)
        const { userid } = rows[0]
        const info = Object.assign(ctx.request.body, { userid: userid })
        rows = await orm.infosInsert(info);
        if (rows.length === 0) throw new Exp(-1, 'infos创建失败', rows)
        let t = ['infoid', 'title', 'txt', 'imgs']
        rows = await orm.resultFilter(rows, t)
        rows = await orm.pathChange(rows)
        throw new Exp(1, '信息提交成功', rows)
    })

router.post('/info/modify/:id',
    async (ctx, next) => {
        const infoid = ctx.params.id
        const { token } = ctx.request.body
        rows = await orm.tokenFind(token);
        if (rows.length === 0) throw new Exp(-1, 'token无效', rows)
        const { userid } = rows[0]
        const info = Object.assign(ctx.request.body, { userid: userid,infoid: infoid })
        rows = await orm.infosUpdate(info);
        if (rows.length === 0) throw new Exp(-1, 'infos修改失败', rows)
        throw new Exp(1, '信息修改成功', rows)
    })

router.post('/info/manage/:infoid/:fieldname/:value',
    async (ctx, next) => {
        const {infoid,fieldname,value} = ctx.params
        const { token } = ctx.request.body
        rows = await orm.tokenFind(token);
        if (rows.length === 0) throw new Exp(-1, 'token无效', rows)
        const { userid } = rows[0]
        const info = Object.assign(ctx.request.body, { userid: userid,infoid: infoid,fieldname: fieldname,fielddata:value })
        rows = await orm.infosManage(info);
        if (rows.length === 0) throw new Exp(-1, '信息管理写入失败', rows)
        throw new Exp(1, '信息修改成功', rows)
    })

router.post('/info/list',
    async (ctx, next) => {

        let rows
        rows = await orm.infosList({count:20});
        if (rows.length === 0) throw new Exp(1, '信息列表数据无', rows)
        let t = ['infoid', 'txt', 'imgs', 'userid', 'nick_name', 'avatar_url', 'post_time', 'formattime', 'comment', 'comment_time']
        rows = await orm.resultFilter(rows, t)
        rows = await orm.pathChange(rows)
        let ret = new Exp(1, '信息获取成功', rows)
        Config.app.cacheOpen && cache.set(ctx.request, ret).then(cache.expire(ctx.request, 60))
        ctx.set('Cache-Control', 'max-age=60')//开启缓存1m
        throw ret

    })

router.post('/info/mylist',
    async (ctx, next) => {
        const {token} = ctx.request.body
        let rows = await orm.tokenFind(token);
        if (rows.length === 0) throw new Exp(-1, 'token无效', rows)
        const { userid } = rows[0]
        rows = await orm.infosList({userid:userid});
        if (rows.length === 0) throw new Exp(1, '信息列表数据无', rows)
        let t = ['infoid', 'title', 'txt', 'imgs', 'is_done', 'is_deleted', 'post_time', 'formattime', 'comment', 'comment_time']
        rows = await orm.resultFilter(rows, t)
        rows = await orm.pathChange(rows)
        let ret = new Exp(1, '信息获取成功', rows)
        Config.app.cacheOpen && cache.set(ctx.request, ret).then(cache.expire(ctx.request, 60))
        ctx.set('Cache-Control', 'max-age=60')//开启缓存1m
        throw ret

    })

router.post('/info/id/:id',
    async (ctx, next) => {

        const infoid = ctx.params.id
        let rows
        rows = await orm.infoGet(infoid);
        if (rows.length === 0) throw new Exp(-1, '信息数据无', [])
        rows = await orm.pathChange(rows)
        ret = new Exp(1, '信息获取成功', rows)
        Config.app.cacheOpen && cache.set(ctx.request, ret).then(cache.expire(ctx.request, 60))
        ctx.set('Cache-Control', 'max-age=60')//开启缓存1m
        throw ret
    })

router.post('/info/comment/insert',
    async (ctx, next) => {

        const { token, infoid } = ctx.request.body
        rows = await orm.tokenFind(token);
        if (rows.length === 0) throw new Exp(-1, 'token无效', rows)
        const { userid } = rows[0]
        const comment = Object.assign(ctx.request.body, { userid: userid })
        rows = await orm.commentsInsert(comment);
        if (rows.length === 0) throw new Exp(-1, 'comments写入失败', rows)
        throw new Exp(1, '信息提交成功', rows )
    })

router.post('/info/comment/infoid/:id',
    async (ctx, next) => {

        const infoid = ctx.params.id
        let rows
        rows = await orm.commentsGet(infoid);
        //if (rows.length === 0) throw new Exp(-1, '消息数据无', [])
        ret = new Exp(1, '消息获取成功', rows)
        Config.app.cacheOpen && cache.set(ctx.request, ret).then(cache.expire(ctx.request, 60))
        ctx.set('Cache-Control', 'max-age=60')//开启缓存1m
        throw ret
    })

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods())
}