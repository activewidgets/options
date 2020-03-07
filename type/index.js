/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function applyStyle(target, source){
    for (let i in source){
        if (!(i in target)){
            target[i] = source[i];
        }
    }
}


function plugin({on, cls, configs}){

    on('column', null, column => configs.forEach(([name, params]) => {

        if (column.type !== name){
            return;
        }

        for (let i in params){
            if (i == 'style'){
                applyStyle(column.style, params.style);
            }
            else if (i == cls && (cls in column)){
                column[cls] += ' ' + params[cls];
            }
            else if (!(i in column)){
                column[i] = params[i];
            }
        }
    }));
}


export default function(...config){
    return {plugin, config};
}