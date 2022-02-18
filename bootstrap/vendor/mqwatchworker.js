/*
 * @Author: hongfu
 * @Date: 2022-02-16 22:21:06
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 10:21:18
 * @Description: 完成消息队列的监视，将结果传递给主进程。格式：{queue: String, data: String}
 */
!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':mqworker')

const amqp = require('amqplib');

let conn = null
let ch = null
let stop = false

process.on('message', async (x) => {
        
        if (x.options !== undefined && x.list !== undefined) {
            if (conn === null) {
                conn = await amqp.connect(x.options[0])
            }
            if (ch === null) {
                ch = await conn.createChannel()
            }
        }

        if (x.stop !== undefined) {
            debug('exiting')
            ch.close()
            conn.close()
            process.send({stopped: true})
            process.exit(1)
        }
        debug('keep going')

        x.list.forEach(async (queueName) => {
            if (stop == true) {
                debug('worker exited')
                process.exit(1)
            }
            return await ch.consume(queueName, (msg) => {
                if (msg !== null) {
                    let data = msg.content.toString();
                    ch.ack(msg);
                    process.send({
                        queue: queueName,
                        data: data
                    })
                }
            })
        });
        
        setTimeout(() => {
            process.send({ask:'Should i continue?'})
        }, 1000);//扫描间隔
})
