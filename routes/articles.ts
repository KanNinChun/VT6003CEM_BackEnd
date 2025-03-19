import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import * as model from '../models/articles';

// Since we are handling articles use a URI that begins with an appropriate path
const router = new Router({ prefix: '/api/v1/articles' });

// Temporarily define some random articles in an array.
// Later this will come from the DB.
const articles = [
    { title: 'hello article', fullText: 'some text here to fill the body' },
    { title: 'another article', fullText: 'again here is some text here to fill' },
    { title: 'coventry university ', fullText: 'some news about coventry university' },
    { title: 'smart campus', fullText: 'smart campus is coming to IVE' }
];

// Now we define the handler functions
const getAll = async (ctx: RouterContext, next: any) => {
    let articles = await model.getAll();
    if (articles.length) {
        ctx.body = articles;
    } else {
        ctx.body = {}
    }
    await next();
}

const getById = async (ctx: RouterContext, next: any) => {
    let id = ctx.params.id;
    let article = await model.getById(id);
    if (article.length) {
        ctx.body = article[0];
    } else {
        ctx.status = 404;
    }
    await next();
}

const createArticle = async (ctx: RouterContext, next: any) => {
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
}

const updateArticle = async (ctx: RouterContext, next: any) => {
    let id = +ctx.params.id;
    const updateArticle = ctx.request.body as { title: string; fullText: string };
    if ((id < articles.length + 1) && (id > 0)) {
        articles[id - 1].title = updateArticle.title;
        articles[id - 1].fullText = updateArticle.fullText;
        ctx.status = 200;
        ctx.body = articles;
    } else {
        ctx.status = 404;
    }
    await next();
}

const deleteArticle = async (ctx: RouterContext, next: any) => {
    let id = +ctx.params.id;
    if ((id < articles.length + 1) && (id > 0)) {
        articles.splice(id - 1, 1);
        ctx.status = 200;
        ctx.body = { message: "Article deleted successfully" };
    }
}

/* Routes are needed to connect path endpoints to handler functions.
 When an Article id needs to be matched we use a pattern to match
 a named route parameter. Here the name of the parameter will be 'id'
 and we will define the pattern to match at least 1 numeral. */
router.get('/', getAll);
router.post('/', bodyParser(), createArticle);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', updateArticle);
router.del('/:id([0-9]{1,})', deleteArticle);

// Finally, define the exported object when import from other scripts.
export { router };