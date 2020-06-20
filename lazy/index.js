/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import store from './store.js';
import loader from './loader.js';


function plugin({include, configs}){
    include(store, {configs});
    include(loader, {configs});
}


export default function(config){
    return {plugin, config};
}