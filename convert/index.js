/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default function(name, fn){
    return function({on}){
        on('column', null, column => {
            if (column.convert === name){
                column.convert = fn;
            }
        });
    };
}
