/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import request from '../request/index.js';
import response from '../response/index.js';
import makeurl from '../url/index.js';


function plugin({props, include, assign, baseURL, fetchConfig}){

    let {api, callbacks, config} = props(),
        noop = () => {};

    include(request());
    include(response());
    include(makeurl());

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


    function sendRequest(url, store, arg, cb1, cb2){

        let {params} = props();

        if (store !== api.rows){
            params = {};
        }

        if (arg){
            params = assign({}, params, callbacks.params(arg));
        }

        url = callbacks.url(url, clean(params));

        return callbacks.request(url, config.fetch).then(res => processResponse(res, cb1, cb2));
    }


    function processResponse(res, cb1, cb2){

        if (!res.ok){
            throw new Error(res.statusText || res.status);
        }

        return callbacks.response(res, cb1 || noop, cb2 || noop);
    }


    callbacks.props.push((url, store) => {

        if (typeof url != 'string'){
            return;
        }

        if (!callbacks.params){
            return () => sendRequest(url, store);
        }
        
        if (callbacks.response.length == 1){
            return (params) => sendRequest(url, store, params || {});
        }

        if (callbacks.response.length == 2){
            return (params, cb1) => sendRequest(url, store, params || {}, cb1);
        }

        if (callbacks.response.length == 3){
            return (params, cb1, cb2) => sendRequest(url, store, params || {}, cb1, cb2);
        }
    });
}


export default function(baseURL, fetchConfig){

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