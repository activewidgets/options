/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 function plugin({props, fn}){

    let {callbacks} = props();

    if (fn) {
        callbacks.response = fn;
    }
    else if(!callbacks.response){
        callbacks.response = res => res.json();
    }
}


export default function(fn){

    if (fn && typeof fn != 'function'){
        throw new Error('function expected');
    }

    return ({include}) => include(plugin, {fn});
}