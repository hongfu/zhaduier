/*
 * @Author: hongfu
 * @Date: 2022-01-24 11:38:02
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-28 12:57:28
 * @Description: Redis class
 */

!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':Redis')

/**
 * 对Redis作为缓存的封装
 */
const options = process.env.REDIS;

class Cache {
    constructor(opt) {
        this.options = opt || options;
        const Redis = require('redis')
        this.cache = Redis.createClient(this.options);
    }

    get = function (key) {
        let _self = this;
        return new Promise((resolve, reject) => {
            _self.cache.get(key, (err, ret) => {
                if (err) {
                    reject(ret)
                } else {
                    resolve(ret)
                }
            })
        })

    }

    set = function (key, data) {
        let _self = this;
        return new Promise((resolve, reject) => {
            _self.cache.set(key, JSON.stringify(data), (err, ret) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(ret)
                }
            })
        })
    }

    cancel = function (key, tm) {
        let _self = this;
        return new Promise((resolve, reject) => {
            _self.cache.expire(key, tm, (err, ret) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(ret)
                }
            })
        })
    }

    test() {
        let _self = this;
        _self.set('key1', 'test').then(res => debug('redis 存储自检结束', res)).catch(err => debug('redis 存储自检错误', err));
        _self.get('key1').then(res => debug('redis 读取自检结束', res)).catch(err => debug('redis 读取自检错误', err));
        _self.cancel('key1', 0).then(res => debug('redis 过期自检结束', res)).catch(err => debug('redis 过期自检错误', err));
    }
}

module.exports = Cache