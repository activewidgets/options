/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({props, cls, assign, configs}){

    let {callbacks} = props();

    callbacks.column.push(col => {
        configs.forEach(params => {

            if (typeof params == 'function'){
                params = params(col) || {};
            }

            for (let i in params){
                if (i == 'style'){
                    col.style = assign({}, params.style, col.style);
                }
                else if (i == cls && (cls in col)){
                    col[cls] += ' ' + params[cls];
                }
                else if (!(i in col)){
                    col[i] = params[i];
                }
            }
        });    
    });
}


export default function(config){
    return {plugin, config, priority: -10};
}