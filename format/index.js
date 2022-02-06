/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 function noop(value){
    return value;
}


function plugin({props}, name, value, fn){

    let {callbacks, config} = props();


    function processFormat(col){

        let pattern = col.format;

        col.format = noop;

        if (typeof pattern == 'string' && pattern in config.formats){
            pattern = config.formats[pattern];
        }

        if (typeof pattern == 'function'){
            col.format = pattern;
        }
        else if (pattern){
            for(let i=0; i<callbacks.formats.length; i++){
                let formatFn = callbacks.formats[i](pattern);
                if (formatFn){
                    col.format = formatFn;
                    return;
                }
            }
            throw new Error('unknown format pattern - ' + pattern);
        }
    }


    if (!config.formats){
        config.formats = {};
        callbacks.formats = [];
        callbacks.column.push(processFormat);
    }

    if (fn){
        callbacks.formats.push(fn);
    }
    else {
        config.formats[name] = value;
    }
}


export function format(name, value){

    let fn;

    if (typeof name == 'function' && !value){
        fn = name;
        name = null;
        value = null;
    }
    else if (typeof name != 'string' || !value){
        throw new Error('invalid arguments');
    }

    return ctx => plugin(ctx, name, value, fn);
}