/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function plugin({props, on, emit, cls}){

    let selected = 0, {callbacks} = props();

    on('mouse', function({row}){
        selected = row.index;
        emit('refresh', 'rows');
    });

    callbacks.row.push(function(row){
        if (row.index === selected){
            row[cls] = (row[cls] ? row[cls] + ' ' : '') + 'ax-selected';
        }
    });
}

export default function(){
    return {plugin};
}