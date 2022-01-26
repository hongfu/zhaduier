/*
 * @Author: hongfu
 * @Date: 2022-01-23 10:03:24
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-23 11:42:04
 * @Description: 引用配置
 */

const Fs = require("fs")
const Path = require("path")
const Debug = require('debug');

const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaRouter = require('koa-router')
const KoaLogger = require('koa-logger')
const KoaSend = require('koa-send')
const KoaMulter = require('@koa/multer')

const Gm = require('gm').subClass({ imageMagick: true })
const Got = require('got')
const Crypto = require('crypto');

const Redis = require('redis')
const {Pool}  = require('pg')

//此服务设置
const Config = require('../config')
//数据库访问链接
const Db = new Pool(Config.database[Config.database.default])

/**
 * @description: 封装api返回内容
 * @param {*}
 * @return {*}
 */
class Exp extends Error{
    constructor(code,message,result){
        super(message)
        this.code = code
        this.message = message
        this.result = result
    }
}

/**
 * @description: 封装错误信息
 * @param {*}
 * @return {*}
 */
class Bxp extends Error{
    constructor(message,url,path,error){
        super(message)
        this.message = message
        this.url = url
        this.path = path
        this.error = error
    }
}


module.exports = {
    Fs,
    Path,
    Debug,
    Koa,
    KoaBody,
    KoaRouter,
    KoaLogger,
    KoaSend,
    KoaMulter,
    Got,
    Gm,
    Crypto,
    Redis,
    Config,
    KoaLogger,
    Db,
    Exp,
    Bxp
}