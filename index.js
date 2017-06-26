'use strict';

require("./trace");

async function main () {
  console.log("=================================");
  console.log(" Throwing first thing");
  console.log("=================================");

  {  
    const cherrypie = async () => {
      throw new Error(`throwing first thing`);
    };
    const binomial = async () => await cherrypie();
    const abacus = async () => await binomial();
    await checkStack(abacus());
  }

  console.log("=================================");
  console.log(" Throwing after await");
  console.log("=================================");

  {
    const cherrypie = async () => {
      await new Promise((resolve, reject) => setTimeout(resolve, 200));
      throw new Error(`after timeout`);
    };
    const binomial = async () => await cherrypie();
    const abacus = async () => await binomial();
    await checkStack(abacus());
  }
};

main();

async function checkStack(promise) {
  try {
    await promise;
    console.error("should have caught, bailing");
    process.exit(1);
  } catch (e) {
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
  }
}
