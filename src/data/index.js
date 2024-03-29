/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 function plugin({callbacks}, fn){

    if(!callbacks.data){
        callbacks.data = [];
    }

    callbacks.data.push(fn);
}


export function data(fn){

    if (typeof fn != 'function'){
        throw new Error('function expected');
    }

    return comp => plugin(comp, fn);
}