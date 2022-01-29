/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {url as makeurl} from '../url';
import {data as getdata} from '../data';


function plugin({props, include, assign, baseURL, fetchConfig}){

    let {api, callbacks, config} = props();

    include(makeurl());
    include(getdata());

    if (baseURL){
        config.baseURL = baseURL;
    }

    if (fetchConfig){
        config.fetch = fetchConfig;
    }


    function clean(params={}){
        let result = {};
        Object.keys(params).forEach(i => {
            if (typeof params[i] != 'undefined'){
                result[i] = params[i];
            }
        })
        return result;
    }


    function sendRequest(url, store, arg){

        let {params} = props();

        if (store !== api.rows){
            params = {};
        }

        if (arg){
            params = assign({}, params, callbacks.params(arg));
        }

        url = callbacks.url(url, clean(params));

        return callbacks.request(url, config.fetch).then(processResponse);
    }


    function processResponse(res){
        return Promise.resolve(res).then(callbacks.response).then(callbacks.data);
    }


    callbacks.inputs.unshift((url, store) => {

        if (typeof url != 'string'){
            return;
        }

        if (!callbacks.params){
            return () => sendRequest(url, store);
        }
        
        return (params) => sendRequest(url, store, params || {});
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