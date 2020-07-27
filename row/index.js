/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({on, cls, assign, configs}){

    let params = assign({}, ...configs);

    on('row', null, row => {

        for (let i in params){
            if (i == 'style'){
                row.style = assign({}, params.style, row.style);
            }
            else if (i == cls && (cls in row)){
                row[cls] += ' ' + params[cls];
            }
            else if (!(i in row)){
                row[i] = params[i];
            }
        }
    });
}


export default function(config){
    return {plugin, config, priority: -10};
}