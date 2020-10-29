import { saySomething } from './使用Promise改进setTimeout';
import {
  isLastInStock, getFirstCarName, getAverageDollar, sanitizeNames,
} from './函数组合';

import { Container, Maybe } from './support';
import {
  ex1, ex2, ex3, ex4,
} from './函子';

import MyPromise from './MyPromise';

// 异步
console.divider('异步');
saySomething(10); // 30毫秒后打印：hello lagou I love U

// 函数组合
console.divider('函数组合');
const cars = [
  {
    name: 'Ferrari 1', horsepower: 661, dollar_value: 700001, in_stock: true,
  },
  {
    name: 'Ferrari 2', horsepower: 662, dollar_value: 700002, in_stock: false,
  },
  {
    name: 'Ferrari 3', horsepower: 663, dollar_value: 700003, in_stock: false,
  },
  {
    name: 'Ferrari 4', horsepower: 664, dollar_value: 700004, in_stock: false,
  },
  {
    name: 'Ferrari 5', horsepower: 665, dollar_value: 700005, in_stock: true,
  },
  {
    name: 'Ferrari 6', horsepower: 666, dollar_value: 700006, in_stock: false,
  },
];
console.log(isLastInStock(cars)); // 打印 false
console.log(getFirstCarName(cars)); // 打印 Ferrari 1
console.log(getAverageDollar(cars)); // 打印 700003.5
console.log(sanitizeNames(cars[2])); // 打印 ferrari_3

// 函子
console.divider('函子');
const maybe = Maybe.of([5, 6, 1]);
console.log(ex1(4, maybe)._value); // 打印[9, 10, 5]

const xs = Container.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);
console.log(ex2(xs)); // 打印 do

const user = { id: 2, name: 'Albert' };
console.log(ex3(user)); // 打印 A

console.log(ex4('123')); // 打印 123（数字）

// Promise
console.divider('Promise');

const Promise = MyPromise || window.Promise;
console.log(1);
const promise1 = new Promise((resolve, reject) => {
  console.log(2);
  resolve(4);
  reject();
});

promise1
  .then((value) => {
    console.log(value);
    return value + 1;
  })
  .then(123)
  .then(console.log)
  .then(console.log)
  .then(() => Promise.reject(new Error('Unknown Error')))
  .then(null, (value) => { throw value; })
  .catch((err) => {
    console.log(err);
  })
  .finally(() => Promise.reject(new Error('Rejected')))
  .then(null, (reason) => {
    console.log(`rejected reason: ${reason}`);
  })
  .catch((err) => {
    console.log(err);
  });
console.log(3);

Promise.all([6, 7, new Promise((resolve) => { setTimeout(() => { resolve('resolve'); }, 100); }), 8]).then(console.log);
Promise.race([9, 10, Promise.resolve('resolve'), 8]).then(console.log);
// 打印如下
// 1
// 2
// 3
// 4
// 9
// 5
// Error: Unknown Error
// rejected reason: Error: Rejected
// [6, 7, "resolve", 8]
