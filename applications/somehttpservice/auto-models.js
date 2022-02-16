/*
 * @Author: hongfu
 * @Date: 2022-02-14 14:56:32
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 13:54:49
 * @Description: 依据现有数据源生成models
 */
const debug = require('debug')('dev:' + __filename);

const SequelizeAuto = require('sequelize-auto')
const { host, username, password, database, dialect, port } = require('./config').serv_database

const options = {
  host,
  dialect,
  directory: 'models',  // 指定输出 models 文件的目录
  port,
  additional: {
    timestamps: false
  },
  caseModel: 'o',
  tables:['users']//表明，如果不定义就是所有表
}

const auto = new SequelizeAuto(database, username, password, options)

auto.run(err => {
  if (err) throw err
})

