/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This data code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this data tree.
 */


function plugin({on}){

    on('data', null, function(context){

        let {data, params} = context;

        if (typeof data == 'function'){
            context.data = data(params);
        }
    });
}


export default function(){
    return {plugin};
}
