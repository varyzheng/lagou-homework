import fp from 'lodash/fp';

const getStock = (car) => fp.prop('in_stock', car);
const isLastInStock = fp.flowRight(getStock, fp.last);

const getCarName = (car) => fp.prop('name', car);
const getFirstCarName = fp.flowRight(getCarName, fp.first);

const _average = (xs) => fp.reduce(fp.add, 0, xs) / xs.length;
const getDollar = (car) => fp.prop('dollar_value', car);
const getAverageDollar = fp.flowRight(_average, fp.map(getDollar));

const _underscore = fp.replace(/\W+/g, '_');
const toLowerCase = (str) => fp.toLower(str);
const sanitizeNames = fp.flowRight(_underscore, toLowerCase, getCarName);

export {
  isLastInStock, getFirstCarName, getAverageDollar, sanitizeNames,
};
