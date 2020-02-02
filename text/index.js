/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Parser from './parser.js';


function toRange({limit, offset}){
    return 'bytes=' + offset + '-' + (offset ? offset+limit-1 : 9999);
}


function initParser(config){

    let items, sizes;

    config.step = function({data, meta}){
        items.push(data[0]);
        sizes.push(meta.cursor);
    };

    let papa = new Parser(config),
        before = {},
        after = {};

    return function(input, start, end, max){

        let skipFirst = 1,
            skipLast = end < max ? 1 : 0;

        if (start in before){
            input = before[start] + input;
            skipFirst = 0;
        }

        if (end in after){
            input += after[end];
        }

        items = [];
        sizes = [];
        papa.parse(input, 0, skipLast);

        after[start] = input.slice(0, sizes[0]);
        before[end] = input.slice(sizes[sizes.length-1]);

        return items.slice(skipFirst);
    };
}


function parseText(input, range, config, context){

    if (!String(range).match(/(\d+)-(\d+)\/(\d+)/)){
        throw 'incorrect range ' + range;
    }

    if (!context.parse){
        context.parse = initParser(config);
    }

    let start = Number(RegExp.$1),
        end = Number(RegExp.$2) + 1,
        max = Number(RegExp.$3),
        items = context.parse(input, start, end, max);

    return {start, end, max, items};
}


function plugin({state, update, on}, config){

    let {fetch, parse} = state(),
        methods = {},
        range;


    on('fetch', function(req){
        req.headers.accept = '*/*';
        req.headers.range = range;
    });


    methods.fetch = function(url, params, context){
        range = toRange(params);
        return fetch(url, params, context);
    };


    methods.parse = function(res, context){

        if (!res || typeof res.text != 'function'){
            return parse(res, context);
        }

        let range = res.headers.get('content-range');

        return res.text().then(data => parseText(data, range, config, context));
    };


    update(methods);
}


export default function(config, delimiter){

    if (!config || ('props' in config)){
        config = {};
    }

    if (delimiter){
        config.delimiter = delimiter;
    }

    return function(api){
        return plugin(api, config);
    };
}