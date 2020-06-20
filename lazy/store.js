/**
 * Copyright (c) ActiveWidgets SARL. All Rights Reserved.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


function newItem(segment, i, seq){

    let offset = segment.offset + i,
        data = segment.page.items[offset],
        pos = ((segment.length - i) * segment.start  + i * segment.end) / (segment.length + segment.start - segment.end);

    if (segment.end === 1 && i === segment.length - 1){
        pos = 1; // fix rounding error for the last item;
    }

    return {
        index: segment.index + i,
        pos,
        seq,
        data,
        segment
    };
}


function itemsAfter(segment, count, offset, seq, items){

    for(let i=offset; i<segment.length; i++){

        items.push(newItem(segment, i, seq));

        if (items.length >= count){
            return items;
        }
    }

    if (segment.next && segment.next.start === segment.end){
        return itemsAfter(segment.next, count, 0, seq, items);
    }

    return items;
}


function itemsBefore(segment, count, offset, seq, items){

    for(let i=offset; i>=0; i--){

        items.unshift(newItem(segment, i, seq));

        if (items.length >= count){
            return items;
        }
    }

    if (segment.prev && segment.prev.end === segment.start){
        return itemsBefore(segment.prev, count, segment.prev.length-1, seq, items);
    }

    return items;
}


function findAfter(initial, count, offset, seq, pos, lead){

    let segment = initial;

    while(segment.next && pos >= segment.next.start){
        segment = segment.next;
    }

    let target = Math.floor(segment.length * Math.min(1, (pos - segment.start) / (segment.end - segment.start)));

    if (segment.end < 1 && !(segment.next && segment.next.start === segment.end)){
        target = Math.min(target, segment.length - lead, segment.length - count);
    }

    while (target < 0 && segment.start > initial.start){
        segment = segment.prev;
        target += segment.length
    }

    if (segment.start > initial.start || target > offset){
        offset = target;
        seq = {};
    }

    if (offset >= segment.length && typeof pos == 'number' && segment.end < 1 && (!segment.next || segment.next.start !== segment.end)){
        cloneAfter(segment);
    }

    return itemsAfter(segment, count, offset, seq, []);
}


function findBefore(initial, count, offset, seq, pos, lead){

    let segment = initial;

    while(segment.prev && pos < segment.prev.end){
        segment = segment.prev;
    }

    let target = Math.floor(segment.length * Math.max(0, (pos - segment.start) / (segment.end - segment.start)));

    if (segment.start > 0 && !(segment.prev && segment.prev.end === segment.start)){
        target = Math.max(target, lead, count);
    }

    while (target >= segment.length && segment.end < initial.end){
        target -= segment.length
        segment = segment.next;
    }

    if (segment.end < initial.end || target < offset){
        offset = target;
        seq = {};
    }

    if (offset < 0 && typeof pos == 'number' && segment.start > 0 && segment.prev.end !== segment.start){
        cloneBefore(segment);
    }

    return itemsBefore(segment, count, offset, seq, []);
}


function getItems(segment, count, mode, item, pos){

    if (!segment || !count){
        return [];
    }

    let offset = -1,
        seq = {},
        lead = 50;

    if (item){
        segment = item.segment;
        offset = item.index - segment.index;
        seq = item.seq;
    }

    while (segment.replaced){
        segment = segment.replaced;
    }

    if (mode === 'after'){
        return findAfter(segment, count, offset + 1, seq, pos, lead);
    }

    if (mode === 'before'){
        return findBefore(segment, count, offset - 1, seq, pos, lead);
    }
}


function cloneAfter(src){

    let segment = {
        next: src.next,
        prev: src,
        start: src.end,
        end: 2 * src.end - src.start,
        index: src.index + src.length,
        page: src.page,
        offset: src.offset,
        length: src.length,
        clone: true
    };

    if (src.next){
        src.next.prev = segment;
    }

    src.next = segment;
}


function cloneBefore(src){

    let segment = {
        next: src,
        prev: src.prev,
        start: 2 * src.start - src.end,
        end: src.start,
        index: src.index - src.length,
        page: src.page,
        offset: src.offset,
        length: src.length,
        clone: true
    };

    src.prev.next = segment;
    src.prev = segment;
}


function insert(segment, data){

    if (Array.isArray(data)){
        return {
            next: null,
            prev: null,
            start: 0,
            end: 1,
            index: 0,
            page: {items: data},
            offset: 0,
            length: data.length
        };
    }
    else if (data) {

        let max = data.max || data.items.length;

        let newseg = {
            next: null,
            prev: null,
            start: (data.start || 0)/max,
            end: (data.end || (data.start + data.items.length))/max,
            index: (data.start || 0),
            page: data,
            offset: 0,
            length: data.items.length
        };

        if (!segment){
            return newseg;
        }

        let initial = segment;

        while (segment.next && segment.next.index <= newseg.index){
            segment = segment.next;
        }

        newseg.next = segment.next;

        if (segment.index === newseg.index){ // replace
            newseg.prev = segment.prev;
            segment.replaced = newseg;
        }
        else {
            newseg.prev = segment;
        }

        if (newseg.next){
            newseg.next.prev = newseg;
        }

        if (newseg.prev){
            newseg.prev.next = newseg;
        }

        return initial;
    }
    else {
        return segment;
    }
}


export default function({on, emit}){

    let segment;

    on('data', null, context => {

        let {target, async, data, limit = 1000, mode = 'after', base, offset} = context;

        if (target !== 'rows'){
            return;
        }

        let refresh = async && !segment;

        if (data && typeof data == 'object'){
            segment = insert(segment, data);
            if (refresh){
                emit('refresh', 'rows');
            }
        }

        context.items = getItems(segment, limit, mode, base, offset);
    });
}