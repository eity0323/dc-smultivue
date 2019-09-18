
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { resolve, getEntries, getHtmlWebpackPlugins } = require('./webpack.until.js')
const cfg = require('./webpack.cfg.js')
let otherEntries = {}
// 公共js文件入口
if (cfg.commonJs && cfg.commonJs.entry) {
  otherEntries.commonJs = cfg.commonJs.entry
}
module.exports = (env, argv) => {
  return {
    // js入口
    entry: {
      // 默认入口
      ...otherEntries,
      ...getEntries(argv)
    },
    resolve: {  //导入的时候不用写拓展名
      extensions: ['.js', '.vue', '.json','.ts'],
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
      }
    },
    // js输出位置
    output: {
      path: resolve(cfg.build.buildSubDirectory),
      filename: `${cfg.build.assetsSubDirectory}/js/[name].[chunkhash].js`,
      // chunkFilename: `${cfg.build.assetsSubDirectory}/js/[name].[chunkhash].js`,
      publicPath: argv.mode === 'production'
        ? cfg.build.assetsPublicPath
        : cfg.dev.assetsPublicPath
    },

    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
              }
            }]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          }
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'vue-loader',
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8 * 1024,
                name: `${cfg.build.assetsSubDirectory}/img/[name]-[hash:7].[ext]`,
              }
            }
          ]
        },
        {
          test: /\.(woff|eot|ttf)\??.*$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'url-loader',
            options: {
              name: `${cfg.build.assetsSubDirectory}/font/[name].[hash:7].[ext]`,
              limit: 8192
            }
          }
        },
      ]
    },

    plugins: [
      new VueLoaderPlugin(),
      // new webpack.HotModuleReplacementPlugin(), // 启用 热更新
      ...getHtmlWebpackPlugins(argv),// 镜像html文件
      new webpack.LoaderOptionsPlugin({
        options: {
          htmlLoader: {
            root:resolve( './src') // 对于html中的绝对路径进行定位， /assets/a.jpg => path.resolve(__dirname, '/src/assets/a.jpg')
          }
        }
      }),
    ],
  }
}