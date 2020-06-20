/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


export default function({on}){

    let pages = [],
        pageSize = 100,
        totalCount = 0;

    function pageIndex(i){
        return Math.floor(Math.max(0, Math.min(i, totalCount - 1)) / pageSize);
    }


    on('data', context => {

        let {target, async, data, mode = 'after', base, offset} = context;

        if (target !== 'rows'){
            return;
        }

        let index = 0,
            dir = mode == 'after' ? 1 : -1;

        if (async){
            index = pageIndex(data.offset);
            totalCount = data.max;
            return;
        }

        if (base){
            index = pageIndex(base.index);
        }

        if (offset * totalCount * dir > index * pageSize * dir){
            index = pageIndex(offset * totalCount);
        }

        if (pages[index]) {
            index = pageIndex((index + dir) * pageSize);
        }

        if (pages[index]){
            context.data = null;
        }
        else {
            pages[index] = true;
            context.params = {
                offset: index * pageSize,
                limit: pageSize
            };
        }
    });
}