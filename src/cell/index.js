/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({callbacks}, fn){
    callbacks.cell.push(fn);
}


/**
 * @param {(value?: any, data?: any, column?: any, row?: any) => any} fn 
 * @returns {any}
 */
 export function cell(fn){

    if (typeof fn != 'function'){
        throw new Error('function expected');
    }

    return comp => plugin(comp, fn);
}