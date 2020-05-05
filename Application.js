const http = require('http') // 利用 http 模块
const Context = require('./Context') // 导入 Context 模块

module.exports = class Application {
    constructor() {
        this.middlewares = [] // 保存所有的中间件函数
    }

    // 构建ctx，传入到中间件集合，执行next递归
    callback() {
        return async(req, res) => {

            // 初始化ctx
            const ctx = new Context(req, res);

            //调用 compose 函数，依次处理所有中间件函数
            await this.compose(this.middlewares)(ctx)
                // 最后返回res body
            this.responseBody(ctx)
        }
    }

    // 简单粗暴处理res body
    responseBody(ctx) {
        const content = ctx.body;
        ctx.res.end(content);
        console.log(content)
    }

    // 核心：递归中间件，即所谓的 `next()` 方法，先执行第一个
    compose(middlewares) {
        return ctx => {
            const useMiddleware = i => {
                let fn = middlewares[i] //遍历中间件集合
                if (!fn) {
                    return
                }
                return fn(ctx, () => useMiddleware(i + 1)) //递归执行中间件方法，并且传到一下层，"() => useMiddleware(i + 1)"即 "调用的 await next()"
            }
            return useMiddleware(0)
        }
    }

    // 挂载中间件
    use(middleware) {
        if (typeof middleware !== 'function') throw new TypeError('middleware must be a function!')
            //打包中间件集合，middleware实则是个方法
        this.middlewares.push(middleware)
        return this
    }

    // 启动服务器
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }

}