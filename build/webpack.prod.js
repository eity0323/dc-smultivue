/**
 * @author liyang
 * @version 1.0.0
 * @description 生成环境配置
 */
const webpackCommon = require('./webpack.common.js')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const cfg = require('./webpack.cfg.js')
const { resolve,styleLoader } = require('./webpack.until.js')
module.exports = (env, argv) => {
  return merge(webpackCommon(env, argv), {
    mode: 'production', // 当mode值为'production'时，webpack-dev-server 变动刷新反应很慢
    devtool: cfg.build.productionSourceMap ? '#source-map' : undefined,
    module: {
      rules: [
        // 配置style文件加载器
        {
          test: /\.(css|scss|sass)$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: styleLoader,
            publicPath:'../../'
          })
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin(resolve(cfg.build.buildSubDirectory)),
      // 拷贝静态文件
      new CopyWebpackPlugin([
        {
          from: resolve(cfg.build.assetsSubDirectory),
          to: cfg.build.assetsSubDirectory,
          ignore: ['.*']
        }
      ]),
      new ExtractTextPlugin({
        // css文件输出位置
        filename: `${cfg.build.assetsSubDirectory}/css/[name].[md5:contenthash:hex:20].css`
      }),
      // 代码压缩
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap: cfg.build.productionSourceMap,
        parallel: true
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          // sourcemap: cfg.build.productionSourceMap,
          map: cfg.build.productionSourceMap ? {
            inline: false,
            annotation: true
          } : undefined,
          autoprefixer: { disable: true },
          cssProcessor: require('cssnano'),
          cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
          canPrint: true
        }
      }),
    ],
    // js代码拆分
    optimization: {
      runtimeChunk: {
        name: 'manifest',
      },
      splitChunks: {
        minSize: 20000, // 超过20k才会被打包
        cacheGroups: {
           // node_modules中的代码单独打包
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            minChunks: 1
          },
          // 模块被使用超过两次就单独打包
          commons: {
            name: "commons",
            chunks: "all",
            minChunks: 2
          }
        }
      }
    }
  })
}
