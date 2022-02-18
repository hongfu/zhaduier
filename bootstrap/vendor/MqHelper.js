/*
 * @Author: hongfu
 * @Date: 2022-01-24 11:38:02
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-18 10:44:50
 * @Description: mqtt class
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
     * @description: 发布消息
     * @param {*} queueName string 队列
     * @param {*} msg string 内容
     * @param {*} runCallBack function 回调
     * @return {*}
     */
    async send(queueName, msg, runCallBack) {
        let ch = this.sendChannel
        let que = await ch.assertQueue(queueName)
        debug('发布频道', que)
        return ch.sendToQueue(queueName, new Buffer.from(msg), {},
            (err, ok) => {
                if (err !== null) {
                    debug('发布消息失败', err)
                } else {
                    runCallBack && runCallBack();
                }
                return;
            });
    }


    /**
     * @description: 订阅消息
     * @param {*} queueName string 队列
     * @param {*} receiveCallBack function 回调
     * @return {*}
     */
    async receive(queueName, receiveCallBack) {
        let ch = this.receiveChannel
        let que = await ch.checkQueue(queueName)
        debug('订阅频道', que)
        if (que) {
            return await ch.consume(queueName, (msg) => {
                if (msg !== null) {
                    let data = msg.content.toString();
                    ch.ack(msg);
                    receiveCallBack && receiveCallBack(data);
                }
                return;
            })
        } else {
            debug('订阅频道不存在')
        }

    }


    /**
     * @description: 监听开启
     * @param {*} queue String 队列名
     */    
    async watch(queue) {
        if(queue!==undefined){
            this.watchList.push(queue)
        }
        const opt = {
            options: options,
            list: this.watchList,
        }

        if(this.watching===null){
            const path = require('path')
            this.watching = fork(path.join(__dirname,'./mqwatchworker.js'))
        }

        this.watching.on('message', async (x) => {
            if(x.stopped!==undefined){
                this.watching = null;
                return;
            }
            if(x.ask!==undefined){
                this.watching.send(opt)
            }
            if(x.data!==undefined){
                debug('master got:',x)
                this.watchListener[x.queue].forEach(async(fn)=>{
                    fn(x.data)
                })
            }
        })

        this.watching.send(opt)
    }


    /**
     * @description: 停止监听
     * @param {*} queue String 队列名
     */
    async stopWatch(queue) {
        console.log(queue)
        if(queue==undefined){
            if(this.watching!==null){
                this.watching.send({stop:true})
            }
        }else{
            FN.reject(this.watchList,q=>{
                return q == queue;
            })
        }
    }


    /**
     * @description: 添加消息监听函数
     * @param {*} queueName string 队列
     * @param {*} receiveCallBack function 函数
     * @return {*}
     */
    async bindListener(queueName, receiveCallBack) {
        //bind listener
        if (this.watchListener[queueName] === undefined) {
            this.watchList.push(queueName)
            this.watchListener[queueName] = [receiveCallBack]
        } else {
            this.watchListener[queueName].push(receiveCallBack)
        }
    }


    /**
     * @description: 取消监视
     * @param {*} queueName string 队列
     * @param {*} receiveCallBack function 回调
     * @return {*}
     */
    async unBindListener(queueName, receiveCallBack) {
        //cancel all queueName's listeners
        if (this.watchListener[queueName] !== undefined && receiveCallBack === undefined) {
            delete this.watchListener[queueName]
            FN.reject(this.watchList[queueName], it => {
                return it === queueName;
            })
        }

        //cancel one queueName's listener
        if (this.watchListener[queueName] !== undefined && receiveCallBack !== undefined) {
            FN.reject(this.watchListener[queueName], it => {
                return it === receiveCallBack;
            })
            this.watchListener[queueName].length == 0 && delete this.watchListener[queueName]
        }
    }

    test() {
        let mq = this;
        mq.send('testQueue', 'test', (error) => {
            debug('rabbit 发布自检结束');
        })

        mq.receive('testQueue', (msg) => {
            debug('rabbit 订阅自检结束', msg);
        })
    }
}

class RabbitMQ_old {
    constructor(opt) {
        this.hosts = opt || options;
        this.mq = amqp.connect(options[0]);
    }
    /**
     * @description: 发布消息
     * @param {*} queueName string 队列
     * @param {*} msg string 内容
     * @param {*} runCallBack function 回调
     * @return {*}
     */
    send(queueName, msg, runCallBack) {

        this.mq.then(async (conn) => {
            return conn.createConfirmChannel().then(async (ch) => {
                let que = await ch.assertQueue(queueName)
                debug('发布频道', que)
                ch.sendToQueue(queueName, new Buffer.from(msg), {},
                    (err, ok) => {
                        if (err !== null) {
                            debug('发布消息失败', err)
                        } else {
                            runCallBack && runCallBack();
                        }
                        return ch.close();
                    });

            }).catch(err => debug('发布频道错误', err))
        }).catch(err => debug('发布连接错误', err))

    }


    /**
     * @description: 订阅消息
     * @param {*} queueName string 队列
     * @param {*} receiveCallBack function 回调
     * @return {*}
     */
    receive(queueName, receiveCallBack) {
        let self = this;

        self.mq.then(async (conn) => {
            return conn.createChannel().then(async (ch) => {
                // let que = await ch.assertQueue(queueName)
                // debug(que)
                ch.consume(queueName, (msg) => {
                    if (msg !== null) {
                        let data = msg.content.toString();
                        ch.ack(msg);
                        receiveCallBack && receiveCallBack(data);
                    }
                    return ch.close();
                    // setTimeout(() => {
                    //     if (ch) {
                    //         ch.close();
                    //     }
                    // }, 500)
                }).finally(() => {

                }).catch(err => debug('订阅频道错误', err))
            })
        }).catch(err => debug('订阅连接错误', err));
    }

    test() {
        let mq = this;
        mq.send('testQueue', 'test', (error) => {
            debug('rabbit 发布自检结束');
        })

        mq.receive('testQueue', (msg) => {
            debug('rabbit 订阅自检结束', msg);
        })
    }
}

module.exports = RabbitMQ