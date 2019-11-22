
function request(url, params, config){
    let headers = {accept: 'application/json'};
    return {url, params, headers};
}


function send(req){
    return fetch(req.url, req);
}


function plugin({state, update, emit}, config){

    let {fetch, parse} = state(), methods = {};

    methods.fetch = function(url, params, context){

        if (typeof url != 'string'){
            return fetch(url, params, context);
        }

        let req = request(url, params, config);

        emit('fetch', req);

        return send(req);
    };


    methods.parse = function(res, context){

        if (!res || typeof res.json != 'function'){
            return parse(res, context);
        }

        return res.json().then(v => parse(v, context));
    };

    update(methods);
}


export default function(config){
    return function(api){
        return plugin(api, config);
    };
}