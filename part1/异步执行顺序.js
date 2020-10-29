console.log(1);
setTimeout(() => {
  console.log(6);
}, 0);
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
  .then((value) => { throw value; })
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
setTimeout(() => {
  console.log(7);
}, 3000);
const start = Date.now();
// eslint-disable-next-line no-empty
while (Date.now() - start < 2000) {}
setTimeout(() => {
  console.log(8);
}, 1500);
