import koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import { readJson } from '@/util/json';
import { check } from '@/check';

const app = new koa();
app.use(bodyParser());
app.use(async (ctx: Context) => {
  const result = check(ctx);
  const json = readJson(`/${ctx.path}/${result}`);
  if (json) {
    ctx.body = json;
  } else {
    const json404 = readJson('/404');
    ctx.body = json404;
  }
});
app.listen(9999);
