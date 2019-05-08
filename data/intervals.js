

function add(start, end){

    let i = this.index,
        items = this.items,
        len = items.length;

    i -= i % 2;

    while (i < len - 2 && items[i] < start){
        i += 2;
    }

    while (i > 1 && items[i-1] > end){
        i -= 2;
    }

    if (!len || items[i+1] < start){
        items.push(start, end);
    }
    else if (items[i+1] == start){
        items[i+1] = end;
    }
    else if (!i && items[0] > end){
        items.unshift(start, end);
    }
    else if (!i && items[0] == end){
        items[0] = start;
    }
    else if (items[i-1] == start && items[i] == end){
        items.splice(i-1, 2);
    }
    else if (items[i-1] == start){
        items[i-1] = end;
    }
    else if (items[i] == end){
        items[i] = start;
    }
    else {
        items.splice(i, 0, start, end);
    }

    this.index = Math.min(i, items.length - 1);
}


function has(pos){

    let i = this.index,
        items = this.items,
        len = items.length;

    while (i < len-1 && items[i] < pos){
        ++i;
    }

    while (i > 0 && items[i-1] > pos){
        --i;
    }

    this.index = i;

    if (items[i] == pos){
        this.before = i ? items[i-1] : 0;
        this.after = i < len-1 ? items[i+1] : Infinity;
        return i % 2 ? 2 : 1;
    }

    if (items[i] < pos){
        this.before = items[i];
        this.after = Infinity;
        return 0;
    }

    if (items[i] > pos){
        this.before = i ? items[i-1] : 0;
        this.after = items[i];
        return i % 2 ? 3 : 0 ;
    }
}


export default function(){
    return {
        index: 0,
        before: 0,
        after: 0,
        items: [],
        add,
        has
    };
}

