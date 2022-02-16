<!--
 * @Author: hongfu
 * @Date: 2022-01-26 13:48:46
 * @LastEditors: hongfu
 * @LastEditTime: 2022-02-16 14:32:05
 * @Description: readme file
-->
# zhaduier
基于nodejs展开的后端服务框架，使用过程中会不断完善

# 关于部署
1、 环境配置可采用docker，直接默认安装和启动。当然也可以自行安装所有环境，端口参照 .env 中设置，将端口暴露即可。  

2、 部署环境后，进入 ./applications/somehttpservice 路径下，修改config.js中的配置信息与实际环境一直。  

3、 如果是现有数据库，在当前路径下 运行 node auto-models.js 会自动生成 models，之后就可正常开发了。   

4、 如果是根据model生成数据库，则需要 运行somemodelname.sync()生成数据表。  

5、 

## 目录结构
.env 框架默认配置  
├── applications #开发目录  
│   ├── servicename #某个服务，以单独目录方式开发  
│   │   ├── config.js #服务单独配置文件，优先级高于框架基础配置
│   │   ├── auto-models.js #基于数据库生成models，方式：node auto-models.js,可以修改文件默认生成路径  
│   │   └── index.js #服务入口  
│   └── servicesList.js #要启动的服务列表  
├── bin  
│   └── bootstrap #框架入口  
├── bootstrap #框架支持文件存放目录  
│   ├── vendor #框架扩展支持  
│   ├── helper #服务类型  
│   ├── utils.js #框架用到的一些函数方法  
│   ├── services.js #服务类型列表  
│   ├── vendor.js #没有用遍历引用，所以这个是挂载列表  
│   └── ...  
├── node_modules  
├── package-lock.json  
└── package.json  

##未来
关于开发hrm，可以自己选用合适的方式，我就是supervisor
mqtt配置文件错误导致的异常需要捕获处理,另外由于性能考虑不能每次重新建立连接，需要保存channel实例使用,总之在消息订阅部分会需要更多工作

### 框架整理 2022-2-16
框架加入underscore引用
### 框架整理 2022-1-28
不熟悉sequelize，但不影响使用，框架新加了一些异常捕获处理，会逐步完善。

### http服务部分 2022-1-26
##### 基于koa
##### 缓存  支持redis
##### 消息队列  rabbitmq
##### 数据存储 postgresql数据库
目前使用了sequelize

环境配置可采用docker，直接默认安装和启动，端口参照 .env 设置端口暴露即可

### 主体使用nodejs搭建 2022-1-20
