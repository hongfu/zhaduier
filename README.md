<!--
 * @Author: hongfu
 * @Date: 2022-01-26 13:48:46
 * @LastEditors: hongfu
 * @LastEditTime: 2022-01-26 14:15:28
 * @Description: readme file
-->
# zhaduier
基于nodejs展开的后端服务框架，使用过程中会不断完善

## 目录结构
.env 框架默认配置  
├── applications #开发目录  
│   ├── servicename #某个服务，以单独目录方式开发  
│   │   ├── config.js #服务单独配置文件，优先级高于框架基础配置   
│   │   └── index.js #服务入口  
├── bin  
│   └── bootstrap #框架入口  
├── bootstrap #框架支持文件存放目录  
│   ├── Mq.js #mqtt  
│   ├── DBHelper.js #数据库  
│   ├── Redis #Redis #redis主要作为缓存和将来可能涉及的调度管理  
│   ├── serviceHelper.js #服务类型定义支持  
│   ├── Helpers.js #没有用遍历引用，所以这个是挂载列表  
│   └── ...  
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
