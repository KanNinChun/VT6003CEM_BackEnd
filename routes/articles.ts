import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from "../models/articles";
import { basicAuth } from "../controllers/auth";
import { validateArticle } from "../controllers/validation";

const router = new Router({ prefix: "/api/v1/articles" });

const articles = [
  { title: "hello article", fullText: "some text here to fill the body" },
  { title: "another article", fullText: "another text here to fill the body" },
  { title: "coventry university", fullText: "news from CU" },
  { title: "HKIIT", fullText: "news from VTC" },
];

const getAll = async (ctx: RouterContext, next: any) => {
  let articles = await model.getAll();
  if (articles.length) {
    ctx.body = articles;
  } else {
    ctx.body = {};
  }
  //ctx.body = articles;
  await next();
};
const getById = async (ctx: RouterContext, next: any) => {
  let id = ctx.params.id;
  console.log(id);
  let article = await model.getById(id);
  if (article.length) ctx.body = article[0];
  else ctx.status = 404;
  await next();
  // let id = +ctx.params.idx;
  // if((id<articles.length+1)&&(id>0)){
  //   ctx.body = articles[id-1];
  // } else {
  //   ctx.status = 404;
  // }
};
const createArticle = async (ctx: RouterContext, next: any) => {
  // let { title, fullText }: any = ctx.request.body;
  // let newArticle = { title: title, fullText: fullText};
  // articles.push(newArticle);
  // ctx.status = 201;
  // ctx.body = newArticle;
  const body = ctx.request.body;
  let result = await model.add(body);
  if (result.status == 201) {
    ctx.status = 201;
    ctx.body = body;
  } else {
    ctx.status = 500;
    ctx.body = { err: "insert data failed" };
  }
  await next();
};
const updateArticle = async (ctx: RouterContext, next: any) => {
  await next();
};
const deleteArticle = async (ctx: RouterContext, next: any) => {
  await next();
};

router.get("/", getAll);
router.post("/", basicAuth, bodyParser(), validateArticle, createArticle);
router.get("/:id([0-9]{1,})", getById);
router.put("/:id([0-9]{1,})", updateArticle);
router.del("/:id([0-9]{1,})", deleteArticle);
export { router };
