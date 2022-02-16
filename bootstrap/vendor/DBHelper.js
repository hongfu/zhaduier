/*
 * @Author: hongfu
 * @Date: 2022-01-24 11:38:02
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-15 15:37:13
 * @Description: DB helper
 */

!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':DBHelper')

/**
 * 对数据库的封装
 */
const options = process.env.DB.default;

const Adapter = require('sequelize')

class DB {
    constructor(opt) {
        this.options = opt || options;
        this.db = new Adapter(this.options)
    }
    
    getAdapter(){
        return Sequelize
    }

    getConn(){
        return this.db
    }

    closeConn() {
        this.db.close()
    }

    async test() {
        let _self = this
        try {
            await _self.db.authenticate();
            debug('数据库连接成功');
          } catch (error) {
            debug('数据库连接失败');
          }
    }
}

module.exports = DB