/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function plugin({props, tags, templates}){

    let {callbacks} = props(),
        {DIV} = tags(),
        tpl = templates({loading: () => DIV('ax-loading', {key: 'loading'})});

    callbacks.overlays.push(({loading}) => loading ? tpl.loading({}) : '');
}


export function loading(){
    return plugin;
}