require('./check-versions')()
var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
var opn = require('opn')
var path = require('path')
var express = require('express')
var route=express.Router()
var parseurl = require('parseurl')

var assert = require('assert');
var bodyParser = require('body-parser');
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var redis = require('redis')
var client= redis.createClient();

var app = express()
var hbs = require('hbs');
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var compiler = webpack(webpackConfig)

app.set('view engine','html');
app.engine('html',hbs.__express)

client.on('error', function (err) {
  assert(err instanceof Error);
  assert(err instanceof redis.AbortError);
  assert(err instanceof redis.AggregateError);
  assert.strictEqual(err.errors.length, 2); // The set and get got aggregated in here
  assert.strictEqual(err.code, 'NR_CLOSED');
});
var redisOp=require('../static/data/redis.js')(client);
// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

//session store
app.use(session({
  secret: 'keyboard cat',
  store: new RedisStore({
    client:client,
    "ttl": 60*60*24*30,   //Session的有效期为30天
  }),
  resave:false,
  saveUninitialized:true,
  cookie:{httpOnly: true, maxAge:60*60*1000*24*30}
}))

//查看是否登陆
route.get('/',redisOp.persist)

//查看是否登陆
route.get('/getUserInfo',redisOp.getinfo)

//验证登陆请求
route.post('/loginIn',redisOp.signin)
//修改密码
route.post('/editUser',redisOp.editinfo)

//退出
route.get('/logout',redisOp.signout)

route.get('/login',function(req,res,next){
  res.render('./login.html')
})
app.use(route);


var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))


var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
});

var server = app.listen(port)
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
