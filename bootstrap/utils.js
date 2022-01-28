/*
 * @Author: hongfu
 * @Date: 2022-01-28 12:48:30
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-28 13:42:29
 * @Description: About file
 */

!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':' + __filename)

const Utils = {
    errorParse: (err)=>{
        let ret = ''
        if(err.port && err.syscall=='connect' && err.code=='ECONNREFUSED'){
            ret = '请查看端口'+err.port+'是否启动'
        }

        if(ret==''){
            ret = '未处理异常：'+err.toString()
        }
        return ret;
    }
}

module.exports = Utils