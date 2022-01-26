/*
 * @Author: hongfu
 * @Date: 2022-01-24 11:38:02
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 16:50:44
 * @Description: DB class
 */

!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':DBHelper')

/**
 * 对数据库的封装
 */
const options = process.env.DB.default;

class DB {
    constructor(opt) {
        this.options = opt || options;
        const Sequelize = require('sequelize')
        this.db = new Sequelize(this.options)
    }

    async test() {
        let _self = this
        try {
            await _self.db.authenticate();
            debug('数据库连接正常');
        } catch (error) {
            debug('数据库连接失败:', error);
        }
    }
}

module.exports = DB