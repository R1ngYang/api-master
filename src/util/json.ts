import fs from 'fs';
import { apiDir } from '@/util/api';

export const $ = {};
export const readJson = (path: string) => {
  const shareKeys = {};

  const filePath = `${apiDir}/${path}.json`.replace(/\/+/g, '/');
  // 如果文件不存在直接返回控对象
  if (!fs.existsSync(filePath)) return null;

  let json = String(fs.readFileSync(filePath));
  json = json.replace(/\$<\S*>[^\s\"]+/g, (str) => {
    const strArr = str.split(/<|>/);
    shareKeys[strArr[2]] = strArr[1] || strArr[2];
    return strArr[2];
  });

  return JSON.parse(json, (key, value) => {
    if (value?.includes && value.includes('()=>')) {
      value = eval(`(${value})()`);
    }

    if (shareKeys[key]) {
      $[shareKeys[key]] = value;
    }
    return value;
  });
};
