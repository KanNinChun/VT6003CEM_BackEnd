import Koa from "koa";
import Router, { RouterContext } from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";
import { CustomErrorMessageFunction, query, body, validationResults } from "koa-req-validation";

const app: Koa = new Koa();
const router: Router = new Router();

const customErrorMessage: CustomErrorMessageFunction = (
    _ctx: RouterContext,
    value: string
) => {
    return (
        `The name must be between 3 and 20 ` +
        `characters long but received length ${value.length}`
    );
};

const validatorName = [
    body("name").isLength({
        min: 3
    }).withMessage(customErrorMessage).build(),
    body("id").isInt({ min: 10000, max: 20000 }).build()
]

const films = [
    { film_title: 'Hello article', description: 'some text to fill the body' },
    { film_title: 'another article', description: 'again here is some text here to fill' },
    { film_title: 'coventry university', description: 'some news about coventry university' },
    { film_title: 'smart campus', description: 'smart campus is coming to IVE' }
];

//get & post with validation

router.get('/', query("name").isLength({ min: 3 }).optional().withMessage(customErrorMessage).build(), async (ctx: RouterContext, next: any) => {
    const result = validationResults(ctx);
    if (result.hasErrors()) {
        ctx.status = 422;
        ctx.body = { err: result.mapped() }
    } else {
        ctx.body = { msg: `Hello world! ${ctx.query.name}` };
    }
    await next();
})

router.post('/', ...validatorName, async (ctx: RouterContext, next: any) => {
    const result = validationResults(ctx);
    if (result.hasErrors()) {
        ctx.status = 422;
        ctx.body = { err: result.mapped() }
    } else {
        const data = ctx.request.body; ctx.body = data;
    }
    await next();
})

// get, post, getById and Put of end point /films  
router.get('/films',
    async (ctx: RouterContext, next: any) => {
        ctx.body = films; await next();
    })

router.post('/films',
    async (ctx: RouterContext, next: any) => {
        const newFilm = ctx.request.body as { film_title: string; description: string };
        films.push(newFilm);
        ctx.status = 201;
        ctx.body = newFilm;
        await next();
    })


//by ID
router.get('/films/:id([0-9]{1,})',
    async (ctx: RouterContext, next: any) => {
        let id = +ctx.params.id;
        console.log('id= ' + id)
        if ((id < films.length + 1) && (id > 0)) {
            ctx.body = films[id - 1];
        } else {
            ctx.status = 404;
        }
        await next();
    })

router.put('/films/:id([0-9]{1,})', async (ctx: RouterContext, next: any) => {
    let id = +ctx.params.id;
    const updateFilm = ctx.request.body as { film_title: string; description: string };
    if ((id < films.length + 1) && (id > 0)) {
        films[id - 1].film_title = updateFilm.film_title;
        films[id - 1].description = updateFilm.description;
        ctx.status = 200;
        ctx.body = films;
    } else {
        ctx.status = 404;
    }
    await next();
})

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
})


app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.listen(10888, () => {
    console.log("Koa Started");
})
