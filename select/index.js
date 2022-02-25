/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function plugin({props, update, on, cls}){

    let selected = 0, {api, callbacks} = props();

    on('click', function({target}){
        let cell = api.cellFromElement(target);
        if (cell && cell.section === 'main'){
            selected = cell.row.index;
            update({$rows: {}});
        }
    });

    callbacks.row.push(function(data, id, index){
        if (index === selected){
            return {[cls]: 'ax-selected'};
        }
    });
}

export function select(){
    return plugin;
}