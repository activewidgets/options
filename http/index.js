/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {data as getdata} from '../data';


function plugin({props, include, assign, baseURL, fetchConfig}){

    let {api, callbacks, config} = props();

    include(getdata());

    if (baseURL){
        config.baseURL = baseURL;
    }

    if (fetchConfig){
        config.fetch = fetchConfig;
    }

    if (config.http){
        return; // run once
    }

    config.http = true;


    function send(path, cfg){

        let url = new URL(path, config.baseURL || location.href),
            headers = assign({}, config.fetch && config.fetch.headers, cfg && cfg.headers),
            fetchConfig = assign({}, config.fetch, cfg, {headers});

        if (!headers['Accept']){
            headers['Accept'] = 'application/json; text/plain; */*';
        }
        
        if (fetchConfig.body && !headers['Content-Type']){
            headers['Content-Type'] = 'application/json';
        }

        return Promise.resolve().then(() => callbacks.request(url, fetchConfig)).then(callbacks.response);            
    }


    function convertParams(params){

        let obj = callbacks.params(params),
            result = {};

        Object.keys(obj).forEach(i => {
            if (typeof obj[i] != 'undefined'){
                result[i] = obj[i];
            }
        })
    
        return result;
    }


    function convertData(data){
        return callbacks.data(data);
    }


    function defaultOperation(path){

        if (!callbacks.params){
            return () => send(path).then(convertData);
        }

        return params => send(`${path}?${new URLSearchParams(convertParams(params))}`).then(convertData);
    }


    callbacks.inputs.unshift((path, store) => {

        if (typeof path != 'string'){
            return;
        }

        if (store !== api.rows || !callbacks.httpops){
            return defaultOperation(path);
        }

        let ops = callbacks.httpops.map(fn => fn(path, send, convertParams, convertData));
        return assign({getRows: defaultOperation(path)}, ...ops);
    });
}


export function http(baseURL, fetchConfig){

    if (typeof fetchConfig == 'undefined' && typeof baseURL == 'object'){
        fetchConfig = baseURL;
        baseURL = undefined;
    }

    if (baseURL && typeof URL != 'undefined' && typeof location != 'undefined') {
        baseURL = new URL(baseURL, location.href);
        baseURL.pathname += /\/$/.test(baseURL.pathname) ? '' : '/';
    }

    return ({include}) => include(plugin, {baseURL, fetchConfig});
}