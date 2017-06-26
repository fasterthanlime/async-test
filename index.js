'use strict';

require("./trace");

function firstThing() {
  console.log("=================================");
  console.log(" Throwing first thing");
  console.log("=================================");

  const cherrypie = () => new Promise((resolve, reject) => {
    reject(new Error(`throwing first thing`));
  });
  const binomial = () => cherrypie();
  const abacus = () => binomial();
  return checkStack(abacus());
}

function secondThing() {
  console.log("=================================");
  console.log(" Throwing after await");
  console.log("=================================");

  const cherrypie = () =>
    new Promise((resolve, reject) => setTimeout(resolve, 200))
    .then(() => {
      throw new Error(`after timeout`);
    })
  const binomial = () => cherrypie();
  const abacus = () => binomial();
  return checkStack(abacus());
}

function main () {
  firstThing().then(() => secondThing());
};

main();

function checkStack(promise) {
  return promise.then(() => {
    console.error("should have caught, bailing");
    process.exit(1);
  }).catch((e) => {
    console.log(`Full stack trace:\n${e.stack}\n\n`);

    if (!/at abacus /.test(e.stack)) {
      console.error("didn't see abacus, bailing");
      process.exit(1);
    }
    if (!/at binomial /.test(e.stack)) {
      console.error("didn't see binomial, bailing");
      process.exit(1);
    }
    if (!/at cherrypie /.test(e.stack)) {
      console.error("didn't see cherrypie, bailing");
      process.exit(1);
    }
  });
}
