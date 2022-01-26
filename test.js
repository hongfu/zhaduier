/*
 * @Author: hongfu
 * @Date: 2022-01-25 12:05:27
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-25 12:12:23
 * @Description: test file
 */

const Koa = require('koa');

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000,'127.0.0.1');

console.log(app)
