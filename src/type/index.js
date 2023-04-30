/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({callbacks}, name, params){

    callbacks.beforeColumn.push((column) => {
        if (column.type === name){
            return params;
        }
    });    
}


export function type(name, params){
    return comp => plugin(comp, name, params);
}