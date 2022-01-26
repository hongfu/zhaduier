/*
 * @Author: hongfu
 * @Date: 2022-01-23 10:03:24
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-23 10:44:11
 * @Description: 服务设置
 */
const Path = require('path')

const config={
    //路径
    path: {
        root: Path.join(__dirname, './'),
        include: Path.join(__dirname, './inc'),
        router: Path.join(__dirname, './api'),
        upload: Path.join(__dirname, '../public/static'),
        static: Path.join(__dirname, '../public/static'),
        log: Path.join(__dirname, './logs')
    },
    //文件上传
    upload: {
        enable: true,
        encoding: 'gzip',
        maxfiles: 5,
        maxsize: 2 //M
    },
    //图片压缩
    gm: {
        maxwidth: 600,
        maxheight: 800,
        quality: 50
    },
    //数据库
    database: {
        default: 'pg',
        mysql: {
            database: 'yjm', //数据库名称
            user: 'hongfu', //mysql用户名
            password: '123', //mysql密码
            port: '3306', //mysql端口号
            host: 'localhost' //服务器ip
        },
        pg: {
            user: 'hongfu',
            host: '127.0.0.1',
            database: 'yjm',
            password: '123',
            port: '5432',
        },
        redis: {
            host: '127.0.0.1',
            port: 6379
        }
    },
    //关于服务对应应用的设置
    app: {
        appid: 'wxb533bac451d52e8a',
        AppSecret: '2bbd812a05d251b822c92e0b88770deb',
        appid1: 'wx7349512756016463',
        AppSecret1: 'eea2c2e89b41a3c622a41ceb40405a1c',
        cacheOpen: false,
        //server_domain: 'https://api.zhaduir.ren',  //product
        server_domain: 'http://127.0.0.1:3000',     //develop
        server_prefix: '/yj',
        server_static: '/static/'
    }
}

module.exports = config