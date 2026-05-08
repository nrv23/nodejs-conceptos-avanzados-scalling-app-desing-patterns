export function someAsyncFunction(id) {
  console.log(`Async task with id=${id} is started.`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`Async task with id=${id} is done.`);
      resolve(`Result of task<${id}>: blablabla`);
    }, 200);
  });
}
