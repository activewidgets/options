
import Parser from './parser.js';


function toRange({limit, offset}){
    return 'bytes=' + offset + '-' + (offset ? offset+limit-1 : 9999);
}


function parseText(txt, range, config, context){

    if (!String(range).match(/(\d+)-(\d+)\/(\d+)/)){
        throw 'incorrect range ' + range;
    }

    if (!context.parser){
        context.parser = new Parser(config);
        context.before = {};
        context.after = {};
    }

    let start = Number(RegExp.$1),
        end = Number(RegExp.$2) + 1,
        max = Number(RegExp.$3),
        results = context.parser.parse(txt, 0, true),
        items = results.data.slice(1);

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