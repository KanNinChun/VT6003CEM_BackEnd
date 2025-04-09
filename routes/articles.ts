import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";
import { basicAuth } from "../controllers/auth";
import {validateArticle} from '../controllers/validation';
import * as model from '../models/articles';

// Since we are handling articles use a URI that begins with an appropriate path
const router = new Router({ prefix: '/api/v1/articles' });

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
    let id = +ctx.params.id; // Extract `id` from URL
    let updateData = ctx.request.body; // Extract payload

    // Validate input payload
    if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
        ctx.status = 400;
        ctx.body = { error: "Invalid or missing update data" };
        return;
    }

    try {
        let result = await model.update(updateData, id) as { status: number }; // Update article in DB
        if (result.status === 201) {
            ctx.status = 201;
            ctx.body = { message: `Article with id ${id} updated successfully` };
        } else if (result.status === 404) {
            ctx.status = 404;
            ctx.body = { error: "Article not found" };
        } else {
            throw new Error("Update failed");
        }
    } catch (error) {
        console.error("Error updating article:", error);
        ctx.status = 500;
        ctx.body = { error: "Failed to update article" };
    }

    await next();
};

const deleteArticle = async (ctx: RouterContext, next: any) => {
    let id = ctx.params.id;
    let result = await model.deleteById(id);
    if (result.status === 200) {
        ctx.status = 200;
        ctx.body = { message: "Article deleted successfully" };
    } else {
        ctx.status = 500;
        ctx.body = { error: "Failed to delete article" };
    }
    await next();
}

/* Routes are needed to connect path endpoints to handler functions.
 When an Article id needs to be matched we use a pattern to match
 a named route parameter. Here the name of the parameter will be 'id'
 and we will define the pattern to match at least 1 numeral. */
router.get('/', getAll);
router.post('/', basicAuth, bodyParser(), validateArticle, createArticle);
router.put('/:id([0-9]{1,})', basicAuth, bodyParser(), validateArticle,
updateArticle);
router.get('/:id([0-9]{1,})', getById);
router.del('/:id([0-9]{1,})', deleteArticle);

// Finally, define the exported object when import from other scripts.
export { router };