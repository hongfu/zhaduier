/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:48:59
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 15:57:52
 * @Description: service config file
 */

const options = {
    serv_name: 'somehttpservice',
    serv_type: 'http',
    serv_host: 'localhost',
    serv_port: 3001,
    serv_prefix: 'ncm',
    serv_version: '0.0.1',
    serv_database: {
            port: 5432,
            host: 'localhost',
            user: 'postgres',
            password: 'postgres',
            database: 'postgres',
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

process.env[options.serv_name] = options;

module.exports = options;