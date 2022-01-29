/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {http} from '../http';
import {operations} from '../operations';


function encode(id){
    if (Array.isArray(id)){
        return id.map(encodeURIComponent).join('/');
    }
    return encodeURIComponent(id);
}


function defineOperations(url, send){

    function insertRow(data){
        return send(url, {method: 'POST', body: JSON.stringify(data)})
    }

    function updateRow(id, data){
        return send(`${url}/${encode(id)}`, {method: 'PATCH', body: JSON.stringify(data)})
    }

    function deleteRow(id){
        return send(`${url}/${encode(id)}`, {method: 'DELETE'});
    }

    return {insertRow, updateRow, deleteRow};
}


export function rest(baseURL, fetchConfig){
    return [
        http(baseURL, fetchConfig),
        operations(defineOperations)
    ];
}