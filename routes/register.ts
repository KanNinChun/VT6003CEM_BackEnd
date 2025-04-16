import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from "../models/users";
import { basicAuth } from "../controllers/auth";
import { validateArticle } from "../controllers/validation";

const router = new Router({ prefix: "/api/v1/register" });

interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

const register = async (ctx: RouterContext, next: any) => {
  const body = ctx.request.body as RegisterBody;
  const { username, email, password } = body;
  let result = await model.register(username, email, password);
  if (result && Array.isArray(result) && result.length > 0) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "insert data failed" };
  }
  await next();
};

router.post("/", bodyParser(),  register);

export { router };
