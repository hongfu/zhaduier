/*
 * @Author: hongfu
 * @Date: 2022-01-24 11:38:02
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 15:54:45
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
        this.index = 0;
        this.length = this.hosts.length;
        this.open = amqp.connect(this.hosts[this.index]);
    }
    send(queueName, msg, errCallBack) {
        let self = this;

        self.open
            .then(function (conn) {
                return conn.createChannel();
            })
            .then(function (channel) {
                return channel.assertQueue(queueName).then(function (ok) {
                    return channel.sendToQueue(queueName, new Buffer.from(msg), {
                        persistent: true
                    });
                })
                    .then(function (data) {
                        if (data) {
                            errCallBack && errCallBack(data);
                            channel.close();
                        }
                    })
                    .catch(function () {
                        setTimeout(() => {
                            if (channel) {
                                channel.close();
                            }
                        }, 500)
                    });
            })
            .catch(function (err) {
                let num = self.index++;

                if (num <= self.length - 1) {
                    self.open = amqp.connect(self.hosts[num]);
                } else {
                    self.index = 0;
                }
            });
    }

    receive(queueName, receiveCallBack, errCallBack) {
        let self = this;

        self.open
            .then(function (conn) {
                return conn.createChannel();
            })
            .then(function (channel) {
                return channel.assertQueue(queueName)
                    .then(function (ok) {
                        return channel.consume(queueName, function (msg) {
                            if (msg !== null) {
                                let data = msg.content.toString();
                                channel.ack(msg);
                                receiveCallBack && receiveCallBack(data);
                            }
                        })
                            .finally(function () {
                                setTimeout(() => {
                                    if (channel) {
                                        channel.close();
                                    }
                                }, 500)
                            });
                    })
            })
            .catch(function () {
                let num = self.index++;
                if (num <= self.length - 1) {
                    self.open = amqp.connect(self.hosts[num]);
                } else {
                    self.index = 0;
                }
            });
    }

    test() {
        let mq = this;
        mq.send('testQueue', 'test', (error) => {
            error
                ? debug('rabbit 发布自检结束', error)
                : debug('rabbit 发布自检错误', error);
        })

        mq.receive('testQueue', (msg) => {
            debug('rabbit 订阅自检结束', msg);
        })
    }
}

module.exports = RabbitMQ