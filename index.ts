import Koa from "koa";
import Router, { RouterContext } from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import passport from "koa-passport";
import serve from 'koa-static';
import { router as articles } from "./routes/articles";
import { router as special } from "./routes/specials";
import{ router as register } from "./routes/register";
import cors from '@koa/cors';

const app: Koa = new Koa();
const welcomeAPI = async (ctx: RouterContext, next: any) => {
  ctx.body = {
    msg: "Welcome to the blog API",
  };
  await next();
};
const router: Router = new Router();

//router.get('/api/v1', welcomeAPI);

app.use(cors());
app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes());
app.use(serve('./docs'));
app.use(passport.initialize());
app.use(special.middleware());
app.use(articles.middleware());
app.use(register.middleware());

app.use(async (ctx: RouterContext, next: any) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.status = 404;
      ctx.body = { err: "No such endpoint existed" };
    }
  } catch (err: any) {
    ctx.body = { err: err };
  }
});

app.listen(10888, () => {
  console.log("Koa Started");
});
