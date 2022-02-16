/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({props}, config){

    let {callbacks} = props();

    if (typeof config == 'function'){
        callbacks.column.push(config);
    }
    else {
        callbacks.beforeColumn.unshift(() => config);
    }
}


export function column(config){
    return comp => plugin(comp, config);
}