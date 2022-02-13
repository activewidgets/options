/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function plugin({props, update, on, cls}){

    let selected = 0, {callbacks} = props();

    on('mouse', function({row}){
        selected = row.index;
        update({$rows: {}});
    });

    callbacks.row.push(function(row){
        if (row.index === selected){
            row[cls] = (row[cls] ? row[cls] + ' ' : '') + 'ax-selected';
        }
    });
}

export function select(){
    return plugin;
}