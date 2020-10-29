const sleep = (time, value) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(value);
  }, time);
});

const saySomething = (time) => {
  sleep(time, 'hello')
    .then((value) => sleep(time, `${value} lagou`))
    .then((value) => sleep(time, `${value} I love U`))
    .then(console.log);
};

export { saySomething };
