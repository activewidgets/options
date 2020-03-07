/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({on, emit, assign, configs}){


    function encodeParams(url, params = {}){

        Object.keys(params).forEach(i => {
            url += (url.indexOf('?') >= 0 ? '&' : '?') + i + '=' + encodeURIComponent(params[i]);
        });

        return url;
    }


    function sendRequest(context){

        context.url = context.data;
        context.request = assign({}, ...configs);

        emit('request', context);

        let {data, url, params, request} = context;

        if (typeof data === 'string'){
            context.data = fetch(encodeParams(url, params), request);
        }
    }


    function processResponse(context){

        let {data: response} = context;

        context.response = response;
        emit('response', context);

        if (context.data !== response){
            return;
        }
        else if (!response.ok){
            context.data = {error: response.statusText};
        }
        else if (String(response.headers.get('content-type')).indexOf('application/json') === 0){
            context.data = response.json();
        }
        else {
            context.data = response.text();
        }
    }


    function parseText(context){
        let {data} = context;
        context.data = JSON.parse(data.value);
    }


    on('data', null, function(context){

        let {data} = context;

        if (typeof data == 'string'){
            sendRequest(context);
        }
        else if (data && typeof data.json == 'function'){
            processResponse(context);
        }
        else if (data && typeof data.value == 'string'){
            parseText(context);
        }
    });
}


export default function(config){
    return {plugin, config};
}