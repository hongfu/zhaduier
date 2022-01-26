/*
 * @Author: hongfu
 * @Date: 2022-01-24 15:48:59
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-25 13:10:37
 * @Description: nuochema config file
 */
!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':xcx_nuochema_api_config')

const options = {
    serv_name: 'xcx_nuochema_api',
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
            database: 'ncm',
    }
}

process.env[options.serv_name] = options;

module.exports = options;