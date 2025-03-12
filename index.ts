import Koa from "koa";
import Router, {RouterContext} from "koa-router";
import logger from "koa-logger";
import json from "koa-json";
import bodyParser from "koa-bodyparser";

const app: Koa = new Koa();
const router: Router = new Router();

type Film = {
    id: number;
    title: string;
    director: string;
    year: number
}

let films: Film[] = [
    { id: 1, title: 'Inception', director: 'Christopher Nolan', year: 2010 },
    { id: 2, title: 'The Matrix', director: 'Lana Wachowski, Lilly Wachowski', year: 1999 },
    { id: 3, title: 'The Godfather', director: 'Francis Ford Coppola', year: 1972 }
];

router.get('/', async (ctx: RouterContext, next: any) => {
 ctx.body = { msg: 'Hello world!' };
 await next();
})

router.post('/', async (ctx: RouterContext, next: any) => {
 const data = ctx.request.body;
 ctx.body = data;
 await next();
})

//Get Films
router.get('/films', async (ctx: RouterContext, next: any) => {
    ctx.body = films
    await next();
})

//Post Films
router.post('/films', async (ctx: RouterContext, next: any) => {
    const newFilm: Film = ctx.request.body as Film;
    films.push(newFilm);
    ctx.body = {msg: 'Film added!', film: newFilm};
    await next();
})

// PUT – Update a film
router.put('/films/:id', async (ctx: RouterContext, next: any) => {
    const id = parseInt(ctx.params.id);
    const updatedFilm = ctx.request.body as Film;
    let film = films.find(f => f.id === id);
    
    if (film) {
        film.title = updatedFilm.title;
        film.director = updatedFilm.director;
        film.year = updatedFilm.year;
        ctx.body = { msg: 'Film updated successfully!', film: film };
    } else {
        ctx.status = 404;
        ctx.body = { msg: 'Film not found!' };
    }

    await next();
});

app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());
app.listen(10888, () => {
 console.log("Koa Started");
})