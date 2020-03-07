/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({on, configs}){
    on('column', null, col => configs.forEach(([name, value]) => {
        if (col.format === name){
            col.format = value;
        }
    }));
}


export default function(...config){
    return {plugin, config};
}