/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({props, configs}){

    let {callbacks} = props();

    callbacks.column.push(col => configs.forEach(([name, value]) => {
        if (col.format === name){
            col.format = value;
        }
    }));
}


export function format(...config){
    return {plugin, config};
}