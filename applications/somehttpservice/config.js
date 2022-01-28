/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:48:59
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-28 13:43:47
 * @Description: service config file
 */

const options = {
    serv_name: 'somehttpservice',//服务名称
    serv_type: 'http',//服务类型
    serv_host: 'localhost',
    serv_port: 3001,
    serv_version: '0.0.1',//服务版本
    serv_database_use: true,//是否需要数据库
    serv_database: {
        port: 5432,
        host: 'localhost',
        username: 'postgres',
        password: 'postgres',
        database: 'postgres',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    },
    serv_mqtt_use: true,//是否需要消息服务
    serv_mqtt: {
        hostname: 'localhost'
        , port: 5672
        , username: 'guest'
        , password: 'guest'
        , authMechanism: 'AMQPLAIN'
        , pathname: '/'
        , ssl: {
            enabled: false
        }
    },
    serv_redis_use: true,//是否需要缓存服务
    serv_redis: [{
        port: 6379,
        hostname: 'localhost',
    }],
}

module.exports = options;