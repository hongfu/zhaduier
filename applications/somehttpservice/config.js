/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:48:59
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 16:47:42
 * @Description: service config file
 */

const options = {
    serv_name: 'somehttpservice',
    serv_type: 'http',
    serv_host: 'localhost',
    serv_port: 3001,
    serv_version: '0.0.1',
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
    serv_mqtt: [{
        hostname: 'localhost'
        , port: 5672
        , username: 'guest'
        , password: 'guest'
        , authMechanism: 'AMQPLAIN'
        , pathname: '/'
        , ssl: {
            enabled: false
        }
    }],
    serv_redis: [{
        port: 6379,
        hostname: 'localhost',
    }],
}

module.exports = options;