/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This data code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this data tree.
 */


function plugin({props, update, on, emit, watch, cls}){

    let {sorting = {items: []}} = props(),
        columns = {},
        sorted = {},
        composite = () => 0;


    function makeSortFn(items){

        let {key, direction} = items[0],
            col = columns[key],
            dir = direction === 'desc' ? -1 : 1,
            compare = col.compare;

        sorted[key] = direction;

        return function(data1, data2){
            return dir * compare(data1, data2);
        };
    }


    watch('sorting', function(value){

        sorted = {};
        sorting = value;
        composite = makeSortFn(value.items);
        emit('reload');
    });


    function compare(v1, v2){
        return v1 > v2 ? 1 : (v2 > v1 ? -1 : 0);
    }


    on('sortingChange', function(value){
        emit('sort', value);
    });


    on('column', function(col){

        col.compare = function(data1, data2){
            return compare(col.value(data1), col.value(data2));
        };

        if (sorted[col.key]){
            col.direction = sorted[col.key];
            col.header[cls] = 'ax-sort-' + col.direction;
        }

        columns[col.key] = col;
    });


    on('data', function(context){

        let {target, data} = context;

        if (target === 'rows' && sorting.items.length && data && Array.isArray(data)){
            context.data = data.sort(composite);
        }
    });


    on('mouse', null, function({done, row, column}){
        if (!done && row.type == 'headers'){
            update({sorting: sort(column)});
        }
    });
}


export default function sort(col = {}){

    let {key, field, direction} = col;

    return {
        items: [{key, field, direction: (direction === 'asc' ? 'desc' : 'asc')}],
        plugin
    };
}


