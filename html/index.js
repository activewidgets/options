/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type from '../type/index.js';

export default function(){

    function format(v){
        let output = [];
        output.__html = v;
        return output;
    }

    return type('html', {template: 'html', formats: {default: format}});
}
