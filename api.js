const Koa = require('koa');
const logger = require('koa-logger');
const Router = require('koa-router');
const cors = require('@koa/cors');
const app = new Koa();

//加入中间件
//记录日志
app.use(logger());

//支持跨域请求
app.use(cors());

// 主页
let routerHome = new Router();
routerHome.get('/', async (ctx, next) => {
    ctx.body = 'Hello Koa';
})

let routerRest = new Router();
routerRest.get('/list', async (ctx, next) => { // 请求 /list 路由
    ctx.body = {
        code: 200,
        msg: '请求成功',
        data: 'list列表数据'
    };
}).post('/detail/:id', async (ctx, next) => { // 请求 /detail 路由 参数 id: 10086
    ctx.body = {
        code: 200,
        msg: '请求成功',
        data: 'detail详情数据'
    };
})

// 装载所有路由
let router = new Router();
router.use('/', routerHome.routes(), routerHome.allowedMethods());
router.use('/rest', routerRest.routes(), routerRest.allowedMethods());
app.use(router.routes(), router.allowedMethods());

//监听3000端口
app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
});
