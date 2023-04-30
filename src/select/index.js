/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function plugin({state, update, cls, api, callbacks}){

    let selected = 0;

    callbacks.click.push(function({target}){
        let cell = api.cellFromElement(target);
        if (cell && cell.section === 'main'){
            selected = cell.row.index;
            state.$rows = {};
            update();
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