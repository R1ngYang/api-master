const regex = (str: string, test: string) => {
  return eval(test).test(str);
};

const equals = (str: string | number, test: string | number) => {
  return str === test;
};

const array = (str: string, test: string[]) => {
  const checkFailed: string[] = test.filter((item) => checkCore(str, item));
  return checkFailed.length > 0;
};

export const checkCore = (str: string, test: string) => {
  if (/^\/.*\/$/.test(test)) {
    return regex(str, test);
  }
  if (typeof test === 'string') {
    return equals(str, test);
  }

  if (typeof test === 'number') {
    return equals(parseFloat(str), test);
  }
  if (Array.isArray(test)) {
    return array(str, test);
  }
  return '';
};
