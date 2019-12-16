
import type from '../type/index.js';

export default function(name, fn){

    if (typeof name != 'string' || !(typeof fn == 'function' || typeof fn == 'object')){
        throw new Error('incorrrect/missing arguments');
    }

    let formats = (typeof fn == 'function') ? {default: fn} : fn;

    return type(name, {formats});
}
