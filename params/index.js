/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({props, assign, config}){

    let {callbacks} = props();


    function params(input){
        return assign({}, input);
    }


    if (config) {
        callbacks.params = config;
    }
    else if(!callbacks.params){
        callbacks.params = params;
    }
}


export default function(config){

    if (config && typeof config != 'function'){
        throw new Error('function expected');
    }

    return ({include}) => include(plugin, {config});
}