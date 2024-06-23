export function observe(value) {
  const subscribers = Symbol("subscribers");
  const target = {
    value,
    [subscribers]: [],
  };
  target.subscribe = function (callback) {
    target[subscribers].push(callback);
  };
  return new Proxy(target, {
    set(target, prop, value) {
      if (prop !== "value") {
        throw new Error(`Invalid property ${prop}.`);
      }
      const oldValue = Reflect.get(target, prop);
      if (value !== oldValue) {
        target[subscribers].forEach((subscriber) =>
          subscriber(value, oldValue)
        );
      }
      return Reflect.set(...arguments);
    },
  });
}
