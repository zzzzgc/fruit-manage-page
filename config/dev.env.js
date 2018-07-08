'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 启动前端的端口号
  DEV_PORT: 8085,
  // 后端服务的访问地址，用于代理ajax数据请求
  BACKEND_SERVER: 'http://localhost:8080'
})
