/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({props}, fn){
    
    let {callbacks} = props();
    
    if (!callbacks.httpops){
        callbacks.httpops = [];
    }

    callbacks.httpops.push(fn);
}


export function operations(fn){

    if (typeof fn != 'function'){
        throw new Error('function expected');
    }

    return comp => plugin(comp, fn);
}