/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 function plugin({props, fn}){

    let {callbacks, config} = props();


    function makeURL(input, params){
        let url = new URL(input, config.baseURL || location.href);
        url.search = new URLSearchParams(params);
        return url;
    }


    if (fn) {
        callbacks.url = fn;
    }
    else if(!callbacks.url){
        callbacks.url = makeURL;
    }
}


export function url(fn){

    if (fn && typeof fn != 'function'){
        throw new Error('callback function expected');
    }

    return ({include}) => include(plugin, {fn});
}