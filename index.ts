import Koa from "koa";
import Router, {RouterContext} from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
const app: Koa = new Koa();
const router: Router = new Router();
router.get('/', async (ctx: RouterContext, next: any) => {
 ctx.body = { msg: 'Hello world!' };
 await next();
})
app.use(json());
app.use(logger());
app.use(router.routes()).use(router.allowedMethods());
app.listen(10888, () => {
 console.log("Koa Started");
})