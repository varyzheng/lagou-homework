/* eslint-disable no-param-reassign */
// Promise 三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfiled';
const REJECTED = 'rejected';

// 默认的成功回调和失败回调
const DEFAULT_SUCCESS_CALLBACK = (value) => value;
const DEFAULT_FAIL_CALLBACK = (reason) => reason;

class MyPromise {
  constructor(executor) {
    this._status = PENDING;
    this._successCallbackArray = [];
    this._failCallbackArray = [];
    // 此处需传入this，只传入this._resolve会在Promise真正执行时找不到this指向
    executor(this._resolve.bind(this), this._reject.bind(this));
  }

  // 私有resolve方法，仅在MyPromise内部使用
  _resolve(value) {
    // 状态一经改变，则不会向下执行
    if (this._status !== PENDING) {
      return;
    }
    this._status = FULFILLED;
    this._value = value;
    // 如果事先被保存，则依次执行
    while (this._successCallbackArray.length) {
      this._successCallbackArray.shift()(this._value);
    }
  }

  // 私有reject方法，仅在MyPromise内部使用
  _reject(reason) {
    if (this._status !== PENDING) {
      return;
    }
    this._status = REJECTED;
    this._reason = reason;
    while (this._failCallbackArray.length) {
      this._failCallbackArray.shift()(this._reason);
    }
  }

  // 处理then方法返回的Promise的结果
  static _parseResult(promsie, result, resolve, reject) {
    if (promsie === result) {
      reject(new TypeError('Chaining cycle detected for promise #<Promise>'));
    } else if (result instanceof MyPromise) {
      result.then(resolve, reject);
    } else {
      resolve(result);
    }
  }

  then(successCallback, failCallback) {
    // 如果传入的参数不是函数，则使用默认的callback
    if (typeof successCallback !== 'function') {
      successCallback = DEFAULT_SUCCESS_CALLBACK;
    }
    if (typeof failCallback !== 'function') {
      failCallback = DEFAULT_FAIL_CALLBACK;
    }
    const thenPromise = new MyPromise((resolve, reject) => {
      if (this._status === FULFILLED) {
        // 如果Promise已成功
        // 使用setTimeout模拟异步效果，下同
        setTimeout(() => {
          try {
            // 获得callback的执行结果，并把传递给后边的then方法，下同
            const result = successCallback(this._value);
            MyPromise._parseResult(thenPromise, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else if (this._status === REJECTED) {
        // 如果Promise已成功
        setTimeout(() => {
          try {
            const result = failCallback(this._reason);
            MyPromise._parseResult(thenPromise, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      } else {
        // 如果Promise仍未等待状态，保存then的成功和失败回调到数组中
        this._successCallbackArray.push(() => {
          setTimeout(() => {
            try {
              const result = successCallback(this._value);
              MyPromise._parseResult(thenPromise, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this._failCallbackArray.push(() => {
          setTimeout(() => {
            try {
              const result = failCallback(this._reason);
              MyPromise._parseResult(thenPromise, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });

    return thenPromise;
  }

  // 捕获错误，就是增加一个reject的回调来接收错误，并且继续返回Promise
  catch(failCallback) {
    return this.then(undefined, failCallback);
  }

  // 无论如何都会执行，在成功和失败的回调中调用，并且把值向下传递
  finally(callback) {
    const final = (resolve, reject) => {
      const result = callback();
      if (result instanceof MyPromise) {
        result.then(resolve, reject);
      } else {
        resolve(result);
      }
    };
    return new MyPromise((resolve, reject) => {
      this.then(() => {
        final(resolve, reject);
      }, () => {
        final(resolve, reject);
      });
    });
    // return this.then(
    //   (value) => MyPromise.resolve(callback()).then(() => value),
    //   (reason) => MyPromise.resolve(callback()).then(() => { throw reason; }),
    // );
  }

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((res) => {
      res(value);
    });
  }

  static reject(value) {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((_, rej) => {
      rej(value);
    });
  }

  // 数组内的元素类型可以为Promise或普通值
  static all(array) {
    const result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      // 记录结果的方法
      function addData(key, value) {
        result[key] = value;
        index += 1;
        if (index === array.length) {
          // 结果全部记录完毕后，将结果数组传递出去
          resolve(result);
        }
      }
      for (let i = 0; i < array.length; i += 1) {
        const current = array[i];
        if (current instanceof MyPromise) {
          // 如果值为Promise，则将结果记录下来。一旦失败，整个返回结果失败
          current.then((value) => addData(i, value), (reason) => reject(reason));
        } else {
          // 如果为普通值，则将这个值作为结果记录下来
          addData(i, current);
        }
      }
    });
  }

  // 任何一个resolve或reject，则直接返回结果。普通值则直接resolve
  static race(array) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < array.length; i += 1) {
        const current = array[i];
        if (current instanceof MyPromise) {
          current.then((value) => resolve(value), (value) => reject(value));
        } else {
          resolve(current);
        }
      }
    });
  }
}

export default MyPromise;
