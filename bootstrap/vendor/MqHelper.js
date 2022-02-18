/*
 * @Author: hongfu
 * @Date: 2022-01-24 11:38:02
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 13:02:49
 * @Description: 消息处理主进程，负责消息的发布和订阅
 */

!process.env.FRAMENAME == 'hongfu' && process.exit(1);

const debug = require('debug')(process.env.ENV_MODE + ':MQ')

const FN = require('underscore')

const {
    fork
} = require('child_process')

/**
 * 对RabbitMQ的封装
 */
const options = process.env.MQ;

const amqp = require('amqplib');

class RabbitMQ {
    constructor(opt) {
        this.hosts = opt || options;
        let self = this
        try {
            (async () => {
                self.watching = null
                self.watchList = []
                self.watchListener = {}
                self.conn = await amqp.connect(options[0]);
                self.sendChannel = await self.conn.createConfirmChannel()
                self.receiveChannel = await self.conn.createChannel()
            })()
        } catch (error) {
            debug('mqtt环境错误：', error)
        }
    }
    /**
     * @description: 生产消息
     * @param {*} queueName string 队列
     * @param {*} msg string 内容
     * @param {*} runCallBack function 回调
     * @return {*}
     */
    async send(queueName, msg, runCallBack) {

        let ch = this.sendChannel
        let que = await ch.assertQueue(queueName)
        debug('生产队伍', que)
        let ok = await ch.sendToQueue(queueName, new Buffer.from(msg))
        if (ok) {
            if (runCallBack !== undefined) {
                return runCallBack();
            }
        } else {
            debug('生产消息失败', ok)
        }
    }


    /**
     * @description: 消费消息
     * @param {*} queueName string 队列
     * @param {*} receiveCallBack function 回调
     * @return {*}
     */
    async receive(queueName, receiveCallBack) {
        let ch = this.receiveChannel
        let que = await ch.checkQueue(queueName)
        debug('消费队伍', que)
        if (que) {
            await ch.consume(queueName, (msg) => {
                if (msg !== null) {
                    let data = msg.content.toString();
                    debug('consume msg:', data)
                    ch.ack(msg);
                    if (receiveCallBack !== undefined) {
                        return receiveCallBack(data);
                    }
                }
            })
        } else {
            debug('消费队伍不存在')
        }

    }


    /**
     * @description: 发布
     * @param {*} exchangeName String 交换机
     * @param {*} routingKey String 路径
     * @param {*} msg String 消息
     * @param {*} runCallBack function 回调
     * @return {*}
     */
    async publish(exchangeName, routingKey, msg, runCallBack) {

        let ch = this.receiveChannel
        let que = await ch.assertExchange(exchangeName, 'topic', {
            durable: true
        });
        debug('发布通道：', que)
        let ok = ch.publish(exchangeName, routingKey, new Buffer.from(msg));
        if (ok) {
            if (runCallBack !== undefined) {
                return runCallBack();
            }
        } else {
            debug('发布消息失败', ok)
        }

    }


    /**
     * @description: 订阅
     * @param {*} exchangeName String 交换机
     * @param {*} queueName String 队列
     * @param {*} bindingKey String 规则
     * @param {*} receiveCallBack function 回调
     * @return {*}
     */    
    async subscribe(exchangeName, queueName, bindingKey, receiveCallBack) {

        let ch = this.receiveChannel
        let ex = await ch.assertExchange(exchangeName, 'topic', {
            durable: true
        });
        debug('订阅通道：', ex)
        let que = await ch.assertQueue(queueName);
        debug('订阅队列：', que)
        let ok = await ch.bindQueue(queueName, exchangeName, bindingKey);
        debug('订阅ok：', ok)
        let ok1 = await ch.prefetch(1, false);// count：每次推送给消费端 N 条消息数目，如果这 N 条消息没有被ack，生产端将不会再次推送直到这 N 条消息被消费。global：在哪个级别上做限制，ture 为 channel 上做限制，false 为消费端上做限制，默认为 false。
        debug('订阅ok1：', ok1)
        if (ok1) {
            await ch.consume(queueName, (msg) => {
                if (msg !== null) {
                    let data = msg.content.toString();
                    debug('Subscribe msg:', data)
                    ch.ack(msg);
                    if (receiveCallBack !== undefined) {
                        return receiveCallBack(data);
                    }
                }
            })
        } else {
            debug('订阅无法进行设置')
        }

    }
}

module.exports = RabbitMQ