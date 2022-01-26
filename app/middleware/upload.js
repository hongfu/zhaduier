/*
 * @Author: hongfu
 * @Date: 2022-01-23 10:03:24
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-23 10:49:03
 * @Description: 上传设置
 */

const { KoaBody, Config} = require('../inc')


var upload = KoaBody(
    {
        multipart: Config.upload.enable, // 支持文件上传
        //encoding: Config.upload.encoding,
        formidable: {
            uploadDir: Config.path.upload, // 设置文件上传目录
            keepExtensions: true,    // 保持文件的后缀
            maxFieldsSize: Config.upload.maxsize * 1024 * 1024, // 文件上传大小
        }
    }
)

module.exports = upload