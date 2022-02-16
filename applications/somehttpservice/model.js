/*
 * @Author: hongfu
 * @Date: 2022-02-16 12:33:45
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 14:32:57
 * @Description: 加载model
 */
const debug = require('debug')('dev:' + __filename);

const loadModels = (app)=>{
    try {
        const initModels = require('./models/init-models')
        initModels(app.context.db.getConn())
    } catch (error) {
        debug('没有发现自动生成的数据模型')
    }
}

module.exports = loadModels