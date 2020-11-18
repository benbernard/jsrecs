#!/usr/bin/env node

const Benchmark = require('benchmark');
const Record = require('./lib/record');

const suite = new Benchmark.Suite();

let obj = {};

function createProxy() {
  let proxyObj = {};
  let proxy = new Proxy(proxyObj, {
    set(obj, prop, value) {
      obj[prop] = value;
      return true;
    },
    get(obj, prop, receiver) {
      return Reflect.get(...arguments);
    },
  });
  return proxy;
}

let hash = { prop: "ben" };
class CustomObj {
  constructor(hash) {
    this.hash = hash;
  }
}

for (let key of Object.keys(hash)) {
  Object.defineProperty(CustomObj.prototype, key, {
    get() {
      return this.hash[key];
    },
    set(val) {
      this.hash[key] = val;
    },
  });
}

let dynamicObj = new CustomObj(hash);

// let r = Record.makeRecord({ prop: "foo" });
// r.prop = 7;
// console.log(r);

class Tempy {
  constructor() {
    this.prop = 4;
  }
}

class SetProps {
  constructor(h) {
    for (let key of Object.keys(h)) {
      this[key] = h[key];
    }
  }
}

let count = 0;
suite
  .add("raw object.assign", function () {
    count++;
    let r = new Tempy();
    Object.assign(r, { prop: "foo" });
    r.prop = count;
  })
  .add("Object.assign", function () {
    count++;
    let obj = { prop: "foo" };
    let r = Object.create(Record.prototype);
    Object.assign(r, obj);
    r.prop = count;
  })
  .add("vanilla", function () {
    count++;
    let obj = { prop: "foo" };
    obj.prop = count;
  })
  .add("direct", function () {
    count++;
    let obj = new Tempy();
    obj.prop = count;
  })
  .add("setPrototypeOf", function () {
    count++;
    let obj = { prop: "foo" };
    Object.setPrototypeOf(obj, Record.prototype);
    obj.prop = count;
  })
  .add("setProps", function () {
    count++;
    let obj = new SetProps({ prop: "foo" });
    obj.prop = count;
  })
  // .add("vanilla", function () {
  //   count++;
  //   obj.prop = count;
  // })
  .add("proxy", function () {
    count++;
    let proxy = createProxy();
    proxy.prop = count;
  })
  // .add("dynamic", function () {
  //   count++;
  //   dynamicObj.prop = count;
  // })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run();
