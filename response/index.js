/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 function plugin({props, fn}){
    let {callbacks} = props();
    callbacks.response = fn;
}


export function response(fn){

    if (typeof fn != 'function'){
        throw new Error('function expected');
    }

    return ({include}) => include(plugin, {fn});
}