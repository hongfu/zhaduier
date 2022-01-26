const { Koa } = require('./inc')

const middleware = require('./middleware')

const route = require('./router.js')

const app = new Koa()

middleware(app)

route(app)

module.exports = app
