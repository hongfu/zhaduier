<!--
 * @Author: hongfu
 * @Date: 2022-01-26 13:48:46
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 14:08:02
 * @Description: readme file
-->
# zhaduier
基于nodejs展开的后端服务框架，使用过程中会不断完善

## 目录结构
.env 框架配置  
├── applications #开发目录  
│   ├── servicename #某个服务，以单独目录方式开发  
│   │   ├── config.js #服务配置文件  
│   │   └── index.js #服务入口  
├── bin  
│   └── bootstrap #框架入口  
├── bootstrap #框架支持文件存放目录  
│   └── .  
├── node_modules  
├── package-lock.json  
└── package.json  

### http服务部分 2022-1-26
##### 基于koa
##### 缓存  支持redis
##### 消息队列  rabbitmq
##### 数据存储 postgresql数据库

环境配置可采用docker，直接默认安装和启动，端口参照 .env 设置端口暴露即可

### 主体使用nodejs搭建 2022-1-20
