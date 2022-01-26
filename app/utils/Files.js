const {Fs, Gm, Config, Bxp} = require('../inc')

var zipOneImg = (img,dest) =>{
    return new Promise((resolve,reject,width=Config.gm.maxwidth,height=Config.gm.maxheight,quality=Config.gm.quality)=>{
        Gm(img)
        .resize(width, height, '>') //设置压缩后的w/h
        .setFormat('JPEG')
        .quality(quality) //设置压缩质量: 0-100
        .strip()
        .autoOrient()
        .write(dest,
            function(err) {
                if(err) {
                    reject(new Bxp('写压缩文件错误',img,dest,err))
                }else{
                    resolve(dest)
                }
            })
    }) 

}

var rm = (file) =>{
    return new Promise((resolve,reject)=>{
        Fs.rm(file,
            function(err) {
                if(err) {
                    reject(new Bxp('删除文件错误',file,file,err))
                }else{
                    resolve(true)
                }
            })
    }) 

}

var rename = (file,dest) =>{
    return new Promise((resolve,reject)=>{
        Fs.rename(file,dest,
            function(err) {
                if(err) {
                    reject(new Bxp('重命名文件错误',file,dest,err))
                }else{
                    resolve(true)
                }
            })
    }) 

}

var access = (file,mode) =>{
    return new Promise((resolve,reject)=>{
        Fs.access(file,mode,
            function(err) {
                if(err) {
                    resolve(false)
                }else{
                    resolve(true)
                }
            })
    }) 

}

class Files{
    static isExist = async (file) => {
        return await access(file,Fs.constants.R_OK)
    }
    
    static imgZip = async (files) => {

        for (let i = 0; i <files.length; i++) {
            const filename = files[i].path;
            if(await access(filename, Fs.constants.R_OK)){
                if(files[i].type == 'image/jpeg'){
                    const tmpfile = filename + '_tmp'
                    await zipOneImg(filename,tmpfile)
                    await rm(filename)
                    await rename(tmpfile,filename)  
                    }
              };
        }
    
        return true
    }

}

module.exports = Files