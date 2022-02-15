/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({props, configs}){

    let {callbacks} = props();

    configs.forEach(params => {
        callbacks.row.push(typeof params == 'function' ? params : () => params);
    });
}


export function row(config){
    return {plugin, config, priority: -10};
}