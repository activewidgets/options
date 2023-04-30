/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({state, callbacks}, name, value, fn){

    let {config} = state;


    function processFormat(col){

        let pattern = col.format;

        if (!pattern){
            return;
        }
    
        if (typeof pattern == 'string' && pattern in config.formats){
            pattern = config.formats[pattern];
        }

        if (typeof pattern == 'function'){
            return {fn: {text: pattern}};
        }

        for(let i=0; i<callbacks.formats.length; i++){
            let func = callbacks.formats[i](pattern);
            if (func){
                return {fn: {text: func}};
            }
        }

        throw new Error('unknown format pattern - ' + pattern);
    }


    if (!config.formats){
        config.formats = {};
        callbacks.formats = [];
        callbacks.afterColumn.push(processFormat);
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