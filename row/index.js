/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({props}, config){

    let {callbacks} = props();

    if (typeof config == 'function'){
        callbacks.row.push(config);    
    }
    else {
        callbacks.row.push(() => config);
    }
}


export function row(config){
    return comp => plugin(comp, config);
}