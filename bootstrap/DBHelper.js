/*
 * @Author: hongfu
 * @Date: 2022-01-24 11:38:02
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-24 16:04:01
 * @Description: DB class
 */

!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':DBHelper')

/**
 * 对数据库的封装
 */
options = process.env.DB.pg;

class DB {
    constructor(opt) {
        this.options = opt || options;
        const { Pool } = require('pg')
        this.pool = new Pool(this.options)
    }

    test() {
        let _self = this
        _self.pool.query('SELECT NOW()', (err, res) => {
            if(err){
                debug('postgresql 自检错误',err);
            }else{
                debug('postgresql 自检正常',res.rows);
            }
            _self.pool.end()
        })
    }
}

module.exports = DB