const path = require('path')
// const { resolve } = require('./webpack.until.js')
module.exports = {
  // 页面目录
  pagesDirectory: 'src/pages',
  // 默认所以页面都引用的js文件
  commonJs:{
    entry: path.resolve( path.resolve(__dirname, '../'),'src/js/common_entry.js'), // 默认添加的文件
    // exclude:[''] // Arrary 排除页面，不填所有页面都引入common_css
  },
  // 主要用于移动端的rem适配
  // px2rem:{
  //   remUni:100,
  //   remPrecision: 6
  // },
  dev: {
    assetsPublicPath: '/', // 资源公共路径
    port: 8091,
    proxy: { // 代理
      // "/api": {
      //   target: "http://localhost:3000",
      //   changeOrigin:true,
      //   pathRewrite: {"^/api" : ""}
      // }
    }
  },
  build: {
    buildSubDirectory: 'dist',// 打包输出位置 
    assetsPublicPath: './', // 也可是cdn地址
    assetsSubDirectory: 'static', // 打包后资源路径
    productionSourceMap: false  // 打包生成sourceMap
  }
}