/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This data code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this data tree.
 */


function plugin({props, update, on, emit, watch}){

    let {sorting = {}} = props();

    watch('sorting', function(value){
        sorting = value;
        emit('reload');
    });

    on('column', function(col){
        col.header.actions.default = () => {
            update({sorting: {by: col.key}});
        };

        if (sorting.by === col.key){
            col.header.style = {color: 'red'};
        }
    });

    on('data', function(context){

        let {target, data} = context;

        if (target === 'rows' && sorting.by && data && Array.isArray(data)){
            //...
            context.data = data.reverse();
        }
    });
}

export default function(){
    return {plugin};
}
