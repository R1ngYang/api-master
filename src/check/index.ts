import { readJson } from '@/util/json';
import { Context } from 'koa';
import { checkCore } from '@/check/core';

interface CheckJson {}

const checkSomeThing = (ctx: Context, checkJson: CheckJson) => {
  const checkCtx = {
    request: ctx.request,
    headers: ctx.headers,
    body: ctx.request.body,
    query: ctx.query
  };
  Object.keys(checkCtx).forEach((checkType) => {
    const ctxContent = checkCtx[checkType];
    const checkContent = checkJson[checkType];
    if (!checkContent) return;
    if (checkContent['_exclude'] && checkContent['_exclude'].includes(ctx.path))
      return;
    Object.keys(checkContent || {})
      .filter((key) => !/^\_/.test(key))
      .forEach((key) => {
        const exclude = `_exclude_${key}`;
        if (checkContent[exclude] && checkContent[exclude].includes(ctx.path))
          return;
        const result = checkCore(ctxContent[key] as string, checkContent[key]);
        if (!result) {
          console.log(`验证类型${checkType}`);
          console.log(`验证字段：{key}`);
          console.log(`${ctxContent[key]} =>`);
          console.log(checkContent[key]);
          throw new Error(
            checkContent[`_failed_${key}`] || checkContent['_failed']
          );
        }
      });
  });
};

export const check = (ctx: Context): string => {
  try {
    const globalJson = readJson('check');
    globalJson && checkSomeThing(ctx, globalJson);
    const localJson = readJson(`/${ctx.path}/check`);
    localJson && checkSomeThing(ctx, localJson);
    return '200';
  } catch (e) {
    return e.message;
  }
};
