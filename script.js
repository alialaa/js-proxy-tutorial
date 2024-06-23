import { observe } from "./observe.mjs";

let target = {
  firstName: "Richard",
  lastName: "Morgan",
  get fullName() {
    console.log(this);
    return `${this.firstName} ${this.lastName}`;
  },
};

const handler = {
  get(target, property, receiver) {
    if (property in target) {
      return Reflect.get(...arguments);
    } else {
      return "";
    }
  },
  set(target, prop, value) {
    if (!["age", "firstName", "lastName"].includes(prop)) {
      throw new Error(`Invalid prop name: ${prop}`);
    }
    if (["firstName", "lastName"].includes(prop)) {
      if (typeof value !== "string") {
        throw new TypeError(`Property ${prop} must be a string.`);
      }
    }
    if (prop === "age") {
      if (!Number.isInteger(value)) {
        throw new TypeError("Property age must be an integer.");
      }
      if (value > 70 || value < 18) {
        throw new RangeError("Property age must be between 18 and 70");
      }
    }
    Reflect.set(...arguments);
    return true;
  },
  deleteProperty(target, prop) {
    if (["firstName", "lastName"].includes(prop)) {
      throw new Error(`Cannot delete prop ${prop}`);
    }
    Reflect.deleteProperty(...arguments);
  },
};

target = new Proxy(target, handler);

target.firstName = "Ali";
Object.defineProperty(target, "job", {
  configurable: false,
  value: "Javascript Developer",
  writable: false,
});

function add(x, y) {
  return x + y;
}

add = new Proxy(add, {
  apply: function (target, thisArg, argumentsList) {
    if (argumentsList.length !== 2) {
      throw new Error("Invalid arguments length.");
    }
    return Reflect.apply(...arguments);
  },
});

const x = observe(5);

console.log(x.value);

x.subscribe((v, oldValue) => {
  console.log(v, oldValue);
});

x.subscribe((v) => {
  console.log(v);
});

console.log(x);

x.value = 5;
