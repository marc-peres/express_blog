"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isISOString = void 0;
const isISOString = (val) => {
    if (!val || typeof val !== 'string')
        return false;
    const d = new Date(val);
    return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
};
exports.isISOString = isISOString;
