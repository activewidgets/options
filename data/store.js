
function createRow(data, start, end, max){
    return {
        start,
        end,
        max,
        data
    };
}


// ---------


function chunkFwd(pos, data){

    while (data.next && pos >= data.next.start){
        data = data.next;
    }

    while (data.prev && pos < data.start){
        data = data.prev;
    }

    return data;
}


function chunkBack(pos, data){

    while (data.prev && pos <= data.prev.end){
        data = data.prev;
    }

    while (data.next && pos > data.end){
        data = data.next;
    }

    return data;
}


function findFwd(data, base, pos, ahead){

    if (!(pos > base)){
        return base;
    }

    data = chunkFwd(pos, data);

    /* eslint no-constant-condition: "off" */
    while (true) {

        if (pos + ahead < data.end || data.end == data.max){
            return pos;
        }

        if (!data.next || data.next.start != data.end){
            break;
        }

        data = data.next;
    }

    pos = data.end - ahead;

    while (pos > base){

        if (pos >= data.start){
            return pos;
        }

        if (!data.prev){
            return base;
        }

        pos -= data.start - data.prev.end;
        data = data.prev;
    }

    return base;
}


function findBack(data, base, pos, ahead){

    if (!(pos < base)){
        return base;
    }

    data = chunkBack(pos, data);

    /* eslint no-constant-condition: "off" */
    while (true) {

        if (pos - ahead >= data.start || data.start == 0){ //??
            return pos;
        }

        if (!data.prev || data.prev.end != data.start){
            break;
        }

        data = data.prev;
    }

    pos = data.start + ahead;

    while (pos < base){

        if (pos <= data.end){
            return pos;
        }

        if (!data.next){
            return base;
        }

        pos += data.next.start - data.end;
        data = data.next;
    }

    return base;
}


function itemsFwd(data, results, pos, count, fwd){

    data = chunkFwd(pos, data);

    if (!(pos >= data.start && pos <= data.end)){
        //console.log(pos, data);
        //throw(new Error('target chunk not found')); // ???
        return null; // ???
    }

    let n = data.rows.length,
        r = n ? (data.end - data.start) / n : 0,
        offset = r ? Math.floor((pos - data.start) / r) : 0,
        i;

    if (pos >= data.start + r * (offset + 1)){
        ++offset; // fix rounding
    }

    for(i = offset; results.length < count && i < n; i++){
        results.push(createRow(data.rows[i], data.start + r * i, data.start + r * (i + 1), data.max));
    }

    if (results.length < count && data.next){
        return itemsFwd(data, results, data.next.start, count, fwd);
    }

    return data;
}


function itemsBack(data, results, pos, count, fwd){

    data = chunkBack(pos, data);

    if (!(pos >= data.start && pos <= data.end)){
        //console.log(pos, data);
        //throw(new Error('target chunk not found')); // ???
        return null; // ???
    }

    let n = data.rows.length,
        r = n ? (data.end - data.start) / n : 0,
        offset = r ? Math.floor((pos - data.start) / r) : 0,
        i;

    if (pos >= data.start + r * (offset + 1)){
        ++offset; // fix rounding
    }

    for (i = offset - 1; results.length < count && i >= 0; i--){
        results.unshift(createRow(data.rows[i], data.start + r * i, data.start + r * (i + 1), data.max));
    }

    if (results.length < count && data.prev){
        return itemsBack(data, results, data.prev.end, count, fwd);
    }

    return data;
}


function insert(data, chunk){

    if (!data){
        return chunk;
    }

    while (data.next && data.next.end <= chunk.start){
        data = data.next;
    }

    while (data.prev && data.prev.start >= chunk.end){
        data = data.prev;
    }

    if (data.end <= chunk.start){
        chunk.prev = data;
        chunk.next = data.next
    }
    else if (data.start >= chunk.end){
        chunk.next = data;
        chunk.prev = data.prev;
    }
    else {
        throw new Error('cannot insert new chunk');
    }

    if (chunk.next){
        chunk.next.prev = chunk;
    }

    if (chunk.prev){
        chunk.prev.next = chunk;
    }

    return chunk;
}


export default function(){

    let data, retry;

    function put(chunk){

        data = insert(data, chunk);

        if (retry){
            retry();
            retry = null;
        }
    }


    function get(count, row, skip){

        let pos,
            fwd,
            base = 0,
            results = [],
            r = 0;

        if (row && count > 0){
            base = row.end;
            fwd = base + skip * (row.end - row.start);
        }
        else if (row && count < 0){
            base = row.start;
            fwd = base - skip * (row.end - row.start);
        }

        if (!data){
            results.loading = true;
            results.then = (ok, err) => new Promise(fn => {retry = fn}).then(ok, err);
            return results;
        }

        if (data.rows.length){
            r = (data.end - data.start) / data.rows.length;
        }

        if (count > 0){
            pos = findFwd(data, base, fwd, 60 * r);
            data = itemsFwd(data, results, pos, count, fwd) || data;
        }
        else if (count < 0){
            pos = findBack(data, base, fwd, 60 * r);
            data = itemsBack(data, results, pos, -count, fwd) || data;
        }

        return results;
    }

    return {get, put};
}