import { parseInt } from 'lodash';
import fp from 'lodash/fp';
import { Maybe } from './support';

/**
 * 实现传入的函子加N
 * @param {*} num 要加的数
 * @param {*} functor 目标函子
 */
const ex1 = (num, functor) => {
  const curriedAdd = fp.curry(fp.add);
  const curriedMap = fp.curry(fp.map);
  return functor.map(curriedMap(curriedAdd(num)));
};

const ex2 = (functor) => functor.map(fp.first)._value;

const safeProp = fp.curry((x, o) => Maybe.of(o[x]));
const ex3 = (user) => {
  const getUserName = safeProp('name');
  return getUserName(user).map(fp.first)._value;
};

// Airbnb eslint 规范要求parseInt必须传入进制
const parseInt10 = (num) => parseInt(num, 10);
// const ex4 = (n) => {
//   if (n) {
//     return myParseInt(n);
//   }
//   return null;
// };
const ex4 = (n) => Maybe.of(n).map(parseInt10)._value;

export {
  ex1, ex2, ex3, ex4,
};
