const { Config,Path,Db,Exp } = require('../inc')

class Orm{

    static databaseInit = async () => {
        const pool = Db
        let init = `
        create extension if not exists pgcrypto;--添加加密扩展

        drop table if exists appinfo;
        CREATE TABLE IF NOT EXISTS appinfo(
        title VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,--地址 最大5条
        motto varchar(300)
        );
        
        drop table if exists yaoqing;
        CREATE TABLE IF NOT EXISTS yaoqing(
        yaoqing VARCHAR(64) NOT NULL PRIMARY KEY,
        valided BOOLEAN DEFAULT true--有效
        );
        
        drop table if exists users;--用户信息和鉴权
        create table if not exists users(--用户表
        userid UUID DEFAULT gen_random_uuid() PRIMARY KEY,--用户id
        username VARCHAR(30) NOT NULL,--用户id
        password VARCHAR(64) UNIQUE NOT NULL,--openid
        nick_name VARCHAR(30) NOT NULL,--用户昵称
        avatar_url VARCHAR(255) NOT NULL,--用户头像
        gender VARCHAR(1) NOT NULL,--用户性别
        role VARCHAR(20),--角色
        create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,--创建时间
        valided BOOLEAN DEFAULT true,--有效
        deleted BOOLEAN DEFAULT false--删除
        );
        
        drop table if exists tokens;
        create table if not exists tokens(--token值
        token VARCHAR(30) NOT NULL,--用户TOKEN
        userid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,
        expired TIMESTAMP NOT NULL--过期时间
        );
        
        drop table if exists addresses;
        CREATE TABLE IF NOT EXISTS addresses(
        userid VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,--地址 最大5条
        address JSON
        );
        
        drop table if exists roles;
        CREATE TABLE IF NOT EXISTS roles(--上级角色 0为最高级
        parentid VARCHAR(36) DEFAULT '0',
        role VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,--执行的访问
        access VARCHAR(255) NOT NULL,--有效
        valid BOOLEAN DEFAULT true
        );
        
        drop table if exists infos;--书籍信息
        create table if not exists infos(--书籍表
        infoid UUID DEFAULT gen_random_uuid() PRIMARY KEY,--书籍id
        title VARCHAR(30) DEFAULT '',--书籍标题
        txt VARCHAR(200),--描述
        imgs JSON,
        userid VARCHAR(36) NOT NULL,
        valided BOOLEAN DEFAULT true,--有效
        deleted BOOLEAN DEFAULT false--删除
        );

        drop table if exists info;--书籍信息
        create table if not exists info(--书籍表
        infoid VARCHAR(36) NOT NULL UNIQUE PRIMARY KEY,--书籍id
        post_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_expired BOOLEAN DEFAULT false,
        is_top BOOLEAN DEFAULT false,
        is_done BOOLEAN DEFAULT false,
        done_with VARCHAR(36),
        done_time TIMESTAMP,
        can_exchange BOOLEAN DEFAULT true,
        can_sale BOOLEAN DEFAULT true,
        can_give BOOLEAN DEFAULT true,
        sale_price INT,
        is_deleted BOOLEAN DEFAULT false
        );

        drop table if exists comments;--留言
        create table if not exists comments(--书籍表
        commentid UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        infoid VARCHAR(36) NOT NULL,--书籍id
        comment VARCHAR(200) NOT NULL,--留言
        userid VARCHAR(36) NOT NULL,
        comment_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valided BOOLEAN DEFAULT true,--有效
        deleted BOOLEAN DEFAULT false--删除
        );
        `
        let ret = await pool.query(init)
        return ret
    }

    static resultFilter = async (a,b) => {
        let ret = []
        for (let i = 0; i < a.length; i++) {
            let a1 = a[i];
            let c = Object.getOwnPropertyNames(a1)
            c = c.filter(function (v) {
                if(!b.includes(v)){
                    delete a1[v]
                }else{
                    return true
                }
            })
            Object.getOwnPropertyNames(a1)!=0 && ret.push(a1)
        }
        return ret
    }

    static pathChange = async (rows) => {
        for (let i = 0; i < rows.length; i++) {
            if(rows[i].imgs!=null){
                for (let j = 0; j < rows[i].imgs.length; j++) {
                    rows[i].imgs[j] = Config.app.server_domain + Config.app.server_prefix + Config.app.server_static + Path.basename(rows[i].imgs[j])
                }
            }
        }
        return rows
    }

    static appinfoInsert = async ({title,motto}) => {
        const pool = Db
        let sql = {
            text: "INSERT INTO appinfo(title,motto) VALUES($1,$2) RETURNING *",
            values: [title,motto],
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    static appinfoFind = async () => {
        const pool = Db
        let sql = {
            text: "select * from appinfo limit $1",
            values: [1],
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    // static userByPassword = async (username,password)=>{
    //     const pool = Db
    //     let sql = {
    //         text: "select * from users where username = $1 and password = crypt($2,password) limit 1",
    //         values: [username,password],
    //     }
    //     let ret = await pool.query(sql)
    //     return ret.rows
    // }

    static userByOpenid = async (openid)=>{
        const pool = Db
        let sql = {
            text: "select * from users where password = $1 limit 1",
            values: [openid],
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    static userByUserid = async (userid)=>{
        const pool = Db
        let sql = {
            text: "select * from users where userid::varchar = $1 limit 1",
            values: [userid],
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    static userUpdate = async ({token,username,password,nick_name,avatar_url,gender}) => {
        const pool = Db
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          const updateuser = "INSERT INTO users(username,password,nick_name,avatar_url,gender) VALUES($1,$2,$3,$4,$5) on conflict(password) do update set username = $1,nick_name = $3,avatar_url = $4,gender = $5 RETURNING *"
          const res = await client.query(updateuser, [username,password,nick_name,avatar_url,gender])
          const {userid} = res.rows[0]
          const updatetoken = "insert into tokens (token,userid,expired) values($1,$2,$3) on conflict(userid) do update set token = $1,expired = $3::timestamp with time zone returning *"
          const tokenvalue = [token,userid,new Date(new Date().getTime()+7*24*3600*1000)]
          await client.query(updatetoken, tokenvalue)
          await client.query('COMMIT')
          return res.rows
        } catch (e) {
          await client.query('ROLLBACK')
          throw new Exp(-1, '数据写入错误', e)
        } finally {
          client.release()
        }
    }

    static yaoqingInsert = async (yaoqingma) => {
        const pool = Db
        let sql = {
            text: "insert into yaoqing (valided,yaoqing) values(true,crypt($1,gen_salt('bf',8))) returning *",
            values: [yaoqingma],
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    static yaoqingFind = async (yaoqingma) => {
        const pool = Db
        let sql = {
            text: "SELECT * FROM yaoqing WHERE valided = true and yaoqing = crypt($1,yaoqing) limit 1",
            values: [yaoqingma],
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    static tokenInsert = async (token,userid) => {
        const pool = Db
        let sql = {
            text: "insert into tokens (token,userid,expired) values($1,$2,$3) on conflict(userid) do update set token = $1,expired = $3::timestamp with time zone returning *",
            values: [token,userid,new Date(new Date().getTime()+7*24*3600000)],
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    static tokenFind = async (token) => {
        const pool = Db
        let sql = {
            text: "SELECT * FROM tokens WHERE token = $1 and expired > $2 limit 1",
            values: [token,new Date()],
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    static infosInsert = async (info) => {
        let {txt,imgs,userid} = info
        const pool = Db

        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          const queryText = "INSERT INTO infos(txt,imgs,userid) VALUES($1,$2::json,$3) RETURNING *"
          const res = await client.query(queryText, [txt,JSON.stringify(imgs),userid])
          const insertinfo = 'INSERT INTO info(infoid,post_time,can_sale,sale_price,can_give,can_exchange) VALUES ($1,$2,$3,$4,$5,$6)'
          const infovalue = [res.rows[0].infoid,new Date(),true,0,false,false]
          await client.query(insertinfo, infovalue)
          await client.query('COMMIT')
          return res.rows
        } catch (e) {
          await client.query('ROLLBACK')
          throw new Exp(-1, '数据写入错误', e)
        } finally {
          client.release()
        }
    }

    static infosUpdate = async (info) => {
        const {infoid,txt,imgs,userid} = info
        const pool = Db

        // let sql = "UPDATE info SET can_sale=$3,sale_price=$4,can_give=$5,can_exchange=$6 WHERE infoid::varchar=$1"
        // let res = await pool.query(sql, [infoid,0,can_sale,sale_price,can_give,can_exchange])
        //   console.log(res)
        // return
        
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          let sql = "UPDATE infos SET txt=$1, userid=$2 WHERE infoid::varchar=$3"
          await client.query(sql, [txt,userid,infoid])
          if(imgs != null){
            sql = "UPDATE infos SET imgs=$1::json WHERE infoid::varchar=$2"
            await client.query(sql, [JSON.stringify(imgs),infoid])
          }
        //   sql = "UPDATE info SET can_sale=$2,sale_price=$3,can_give=$4,can_exchange=$5 WHERE infoid::varchar=$1"
        //   await client.query(sql, [infoid,can_sale,sale_price,can_give,can_exchange])
          await client.query('COMMIT')
          return [info]
        } catch (e) {
          await client.query('ROLLBACK')
          throw new Exp(-1, '数据写入错误', e)
        } finally {
          client.release()
        }
    }

    static infosManage = async (info) => {
        const {infoid,userid,fieldname,fielddata} = info
        const pool = Db

        // let sql = "UPDATE info SET can_sale=$3,sale_price=$4,can_give=$5,can_exchange=$6 WHERE infoid::varchar=$1"
        // let res = await pool.query(sql, [infoid,0,can_sale,sale_price,can_give,can_exchange])
        //   console.log(res)
        // return
        
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          let sql = "UPDATE info SET " + fieldname + "=$2 WHERE infoid::varchar=$1"
          await client.query(sql, [infoid,fielddata])
          await client.query('COMMIT')
          return [info]
        } catch (e) {
          await client.query('ROLLBACK')
          throw new Exp(-1, '数据写入错误', e)
        } finally {
          client.release()
        }
    }

    static infosList = async (params) => {
        const {count,userid} = params
        const pool = Db
        let t = "SELECT infos.*,comments.comment,to_char(comments.comment_time, 'MM/DD HH24:MI') as comment_time,users.nick_name,users.avatar_url, info.is_done,to_char(info.post_time, 'MM-DD HH24:MI') as post_time FROM infos "+
        "JOIN info ON infos.infoid::varchar = info.infoid "+
        "JOIN users ON users.userid::varchar = infos.userid::varchar "+
        "LEFT JOIN comments ON info.done_with = comments.commentid::varchar "+
        "WHERE info.is_deleted = false "
        userid && (t = t + "AND infos.userid='" + userid + "' ")
        t = t + "ORDER BY info.post_time DESC "
        count && (t = t + 'LIMIT ' + count)
        let ret = await pool.query(t)
        return ret.rows
    }

    static infoGet = async (infoid) => {
        const pool = Db
        let sql = {
            text: "SELECT *,to_char(info.post_time, 'MM-DD HH24:MI') as formattime FROM infos "+ 
            "JOIN info ON infos.infoid::varchar = info.infoid "+
            "JOIN (select userid,nick_name,avatar_url from users) as users ON users.userid::varchar = infos.userid "+
            //"LEFT JOIN (select infoid as iid,comment,comment_time from comments order by comment_time desc) as comments ON infos.infoid::varchar = comments.iid "+
            "WHERE infos.infoid::varchar = $1 "+
            "limit 1",
            values: [infoid]
        }
        let ret = await pool.query(sql)
        return ret.rows
    }

    static commentsInsert = async (c) => {
        const pool = Db
        const {infoid,userid,comment} = c
        const client = await pool.connect()
        try {
          await client.query('BEGIN')
          let sql = "insert into comments (infoid,userid,comment) values($1,$2,$3) returning *"
          const res = await client.query(sql, [infoid,userid,comment])
          const {commentid} = res.rows[0]
          sql = "update info set done_with = $1 where infoid = $2 returning *"
          await client.query(sql, [commentid,infoid])
          await client.query('COMMIT')
          return res.rows
        } catch (e) {
          await client.query('ROLLBACK')
          throw new Exp(-1, '数据写入错误', e)
        } finally {
          client.release()
        }
    }

    static commentsGet = async (infoid) => {
        const pool = Db
        let sql = {
            text: "select infoid,comments.userid,users.nick_name,users.avatar_url,comment,comment_time,to_char(comment_time, 'MM-DD HH24:MI') as formattime from comments "+ 
            "JOIN users ON users.userid::varchar = comments.userid "+
            "WHERE infoid::varchar = $1 "+
            "order by comment_time desc ",
            values: [infoid]
        }
        let ret = await pool.query(sql)
        return ret.rows
    }
}

module.exports = Orm