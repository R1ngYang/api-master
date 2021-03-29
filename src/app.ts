import koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import { readJson } from '@/util/json';
import { check } from '@/check';

const app = new koa();
app.use(bodyParser());
app.use(async (ctx: Context) => {
  const result = check(ctx);
  ctx.body =
    readJson(`/${ctx.path}/${result}`) ||
    readJson(`/${result}`) ||
    readJson('/404') ||
    404;
});
app.listen(9999);

console.log('start success\n');
console.log('> Local:    http://localhost:9999/');
console.log('> Network:  http://10.1.11.126:9999/');
