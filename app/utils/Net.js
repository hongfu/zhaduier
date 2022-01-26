const { Config, Got } = require('../inc')

class Net{

    static wxGetOpenid = async function (code,appid = Config.app.appid, secret = Config.app.AppSecret) {
        const url = 'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&js_code='+code+'&grant_type=authorization_code'
        const {body} = await Got.post(url)
        return JSON.parse(body)
    }

}

module.exports = Net