const { Redis,Config,Crypto,Exp} = require('../inc')


class Cache{

    static get = function (req) {
        const db = Redis.createClient( Config.database.redis.port, Config.database.redis.host );
        const key = Crypto.createHash('md5').update(JSON.stringify(req)).digest('hex');
        return new Promise((resolve,reject)=>{
            db.get(key,(err,ret)=>{
                if(ret===null){
                    resolve(ret)
                }else{
                    throw new JSON.parse(ret)
                }
            })
        })

    }

    static set = function (req,data) {
        const db = Redis.createClient( Config.database.redis.port, Config.database.redis.host );
        const key = Crypto.createHash('md5').update(JSON.stringify(req)).digest('hex');
        return new Promise((resolve,reject)=>{
            db.set(key,JSON.stringify(data),(err,ret)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(ret)
                }
            })
        })
    }

    static expire = function (req,data) {
        const db = Redis.createClient( Config.database.redis.port, Config.database.redis.host );
        const key = Crypto.createHash('md5').update(JSON.stringify(req)).digest('hex');
        return new Promise((resolve,reject)=>{
            db.expire(key,data,(err,ret)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(ret)
                }
            })
        })
    }
}

module.exports = Cache