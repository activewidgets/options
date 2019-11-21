
import Parser from './parser.js';


function toRange({limit, offset}){
    return 'bytes=' + offset + '-' + (offset ? offset+limit-1 : 9999);
}


function parseText(txt, range, config){

    if (!String(range).match(/(\d+)-(\d+)\/(\d+)/)){
        throw 'incorrect range ' + range;
    }

    let start = Number(RegExp.$1),
        end = Number(RegExp.$2) + 1,
        max = Number(RegExp.$3),
        papa = new Parser(config),
        results = papa.parse(txt, 0, true),
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


    methods.fetch = function(url, params){
        range = toRange(params);
        return fetch(url, params);
    };


    methods.parse = function(res){

        if (!res || typeof res.text != 'function'){
            return parse(res);
        }

        let range = res.headers.get('content-range');

        return res.text().then(data => parseText(data, range, config));
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