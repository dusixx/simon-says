const toStr = Object.prototype.toString;

export const getTypeName = (v) => toStr.call(v).slice(8, -1);
export const isStr = (v) => typeof v === 'string';
export const isInt = (v) => Number.isInteger(Number(v));

export const isIterable = (v) => {
  if (typeof v?.[Symbol.iterator] === 'function') {
    try {
      for (let _ of v) {
        return true;
      }
    } catch {}
  }
  return false;
};
