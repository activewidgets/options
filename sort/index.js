/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This data code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this data tree.
 */


function plugin({props, update, on, emit, cls}){

    let {sort, callbacks} = props(),
        remote = false,
        sortedColumns = {};


    function compare(v1, v2){
        return v1 > v2 ? 1 : (v2 > v1 ? -1 : 0);
    }

    
    function comparator(){

        let [field, direction] = sort.split(' '),
            dir = direction === 'desc' ? -1 : 1;

        return function(data1, data2){
            return dir * compare(data1[field], data2[field]);
        };
    }


    callbacks.compute.push((current, previous) => {

        if (current.sort === previous.sort){
            return;
        }

        sort = current.sort;
        let [field, direction] = sort.split(' ');
        sortedColumns = {[field]: direction};

        return {$recalc: {}, $columns: {}};
    });


    on('sortChange', function(value){
        emit('sort', value);
    });


    callbacks.column.push(function(col){

        if (sortedColumns[col.field]){
            col.direction = sortedColumns[col.field];
            col.header[cls] = 'ax-sort-' + col.direction;
        }
    });


    callbacks.recalc.push(records => {
        if (!Array.isArray(records) || !sort || remote){
            return records;
        }

        records = records.slice();
        records.sort(comparator());
        return records;
    });


    callbacks.getparams.push(() => {
        remote = true;
        if (sort){
            return {sort};
        }
    });


    function toggle(col){
        let {field, direction} = col;
        return field + (direction === 'asc' ? ' desc' : ' asc');
    }


    on('mouse', null, function({done, row, column}){
        if (!done && row.type == 'headers'){
            update({sort: toggle(column)});
        }
    });
}


export function sort(){
    return plugin;
}