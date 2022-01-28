/*
 * @Author: hongfu
 * @Date: 2022-01-24 11:38:02
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-28 13:49:29
 * @Description: mqtt class
 */

!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':MQ')

/**
 * 对RabbitMQ的封装
 */
const options = process.env.MQ;

const amqp = require('amqplib');

class RabbitMQ {
    constructor(opt) {
        this.hosts = opt || options;
        this.mq = amqp.connect(options[0]);
    }
    /**
     * @description: 发布消息
     * @param {*} queueName 队列
     * @param {*} msg 内容
     * @param {*} runCallBack 回调
     * @return {*}
     */    
    send(queueName, msg, runCallBack) {

        this.mq.then(async (conn) => {
            return conn.createChannel().then(async (ch) => {
                let que = await ch.assertQueue(queueName)
                ch.sendToQueue(queueName, new Buffer.from(msg), {
                    persistent: true
                });
                return ch.close();
                runCallBack && runCallBack();
            }).catch(err => debug('发布频道错误', err))
        }).catch(err => debug('发布连接错误', err))

    }

    /**
     * @description: 订阅消息
     * @param {*} queueName 队列
     * @param {*} receiveCallBack 回调
     * @return {*}
     */
    receive(queueName, receiveCallBack) {
        let self = this;

        self.mq.then(async (conn) => {
            return conn.createChannel().then(async (ch) => {
                let que = await ch.assertQueue(queueName)
                ch.consume(queueName, (msg) => {
                    if (msg !== null) {
                        let data = msg.content.toString();
                        ch.ack(msg);
                        receiveCallBack && receiveCallBack(data);
                    }
                }).finally(() => {
                    setTimeout(() => {
                        if (ch) {
                            ch.close();
                        }
                    }, 500)
                }).catch(err => debug('订阅频道错误', err))
            })
        }).catch(err => debug('订阅连接错误', err));
    }

    test() {
        let mq = this;
        mq.send('testQueue', 'test', (error) => {
            error
                ?
                debug('rabbit 发布自检结束', error) :
                debug('rabbit 发布自检错误', error);
        })

        mq.receive('testQueue', (msg) => {
            debug('rabbit 订阅自检结束', msg);
        })
    }
}

module.exports = RabbitMQ