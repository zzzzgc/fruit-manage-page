
'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.
// const path = require('path')

var devConfig = require('./dev.env')
var productConfig = require('./prod.env')
module.exports = {
  build: {
    env: require('./prod.env'),
    // index: path.resolve(__dirname, '../dist/index.html'),
    // assetsRoot: path.resolve(__dirname, '../dist'),
    index: productConfig.BUILD_PATH + '/index.html',
    assetsRoot: productConfig.BUILD_PATH,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: productConfig.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: devConfig.DEV_PORT,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    proxyTable: {
      '/api': {
        target: devConfig.BACKEND_SERVER,
        // target: process.env.BACKEND_SERVER, // 不能使用这种方式，获取不到变量
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
