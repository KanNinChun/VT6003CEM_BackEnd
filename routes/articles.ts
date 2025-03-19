import Router, { RouterContext } from "koa-router";
import bodyParser from "koa-bodyparser";

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
    // Use the response body to send the articles as JSON.
    ctx.body = articles;
    await next();
}

const getById = async (ctx: RouterContext, next: any) => {
    // Get the ID from the route parameters.
    let id = +ctx.params.id
    // If it exists then return the article as JSON.
    // Otherwise return a 404 Not Found status code
    if ((id < articles.length + 1) && (id > 0)) {
        ctx.body = articles[id - 1];
    } else {
        ctx.status = 404;
    }
    await next();
}

const createArticle = async (ctx: RouterContext, next: any) => {
    // The body parser gives us access to the request body on ctx.request.body.
    // Use this to extract the title and fullText we were sent.
    let { title, fullText } = ctx.request.body as { title: string; fullText: string };
    // In turn, define a new article for addition to the array.
    let newArticle = { title: title, fullText: fullText };
    articles.push(newArticle);
    // Finally send back appropriate JSON and status code.
    // Once we move to a DB store, the newArticle sent back will now have its ID.
    ctx.status = 201;
    ctx.body = newArticle;
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