/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This data code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this data tree.
 */

export default function(){

    return function({on}){

        on('data', function(context){

            let {target, data} = context;

            if (target === 'rows' && data && Array.isArray(data.items)){
                //...
            }
        });
    };
}
