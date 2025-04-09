import passport from "koa-passport";
import { BasicStrategy } from "passport-http";
import { RouterContext } from "koa-router";

import * as users from '../models/users';
const verifyPassword = (user: any, password: string) => {
   return user.password === password;
}

passport.use(new BasicStrategy(async (username, password, done)=> {
  let result: any[] = [];
  try {
    result = await users.findByUsername(username);
  } catch(error) {
    console.error(`Error during authenthication for user ${username} ${error}`)
    done(null, false);
  }
  if(result.length) {
    const user = result[0];
    if(verifyPassword(user,password)) {
      done(null, {user: user})
    } else {
      console.log(`Password incorrect for ${username}`);
      done(null, false)
    }
  } else {
    console.log(`no such user ${username}`)
    done(null,false);
  }
  
  // if(username === "dummy" && password == "password") {
  //   done(null, {username: "dummy"})
  // } else {
  //   done(null, false);
  // }
}));

export const basicAuth = async (ctx: RouterContext, next: any) => {
  await passport.authenticate("basic", {session: false}) (ctx, next);
  if (ctx.status == 401) {
    ctx.body = {message: 'you are not authorized'}
  } 
}