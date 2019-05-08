
import intervals from '../data/intervals.js';
import store from '../data/store.js';


export default function(){

    return function ({props, state, update, on, emit}){

        let {get, put} = store(),
            chunks = intervals(),
            limit = 10000,
            max = 0;


        function processRange(response){

            if (!response.range.match(/(\d+)-(\d+)\/(\d+)/)){
                throw 'incorrect range ' + response.range;
            }

            return {
                start: Number(RegExp.$1),
                end: Number(RegExp.$2) + 1,
                max: Number(RegExp.$3),
                rows: response.rows
            };
        }


        function request(pos, dir){

            let offset = Math.floor(pos / limit) * limit;

            if (dir < 0 && pos == offset){
                offset -= limit;
            }

            let start = offset,
                end = Math.min(offset + limit, max),
                range = 'bytes=' + offset + '-' + (offset + limit - 1);

            chunks.add(start, end);

            let {rows} = props(),
                {fetch} = state();

            fetch(rows, {range}, 'rows').then((result) => put(processRange(result)));
        }


        function preload(count, row, skip){

            let pos,
                ahead = 0;

            if (!row || !count){
                return;
            }


            if (count > 0){
                pos = row.end + (skip > 0 ? skip * (row.end - row.start) : 0);
                ahead = (150 + count) * (row.end - row.start);
            }
            else if (count < 0){
                pos = row.start - (skip > 0 ? skip * (row.end - row.start) : 0);
                ahead = (-150 + count) * (row.end - row.start);
            }


            if (ahead > 0){

                if (pos < max && !(chunks.has(pos) & 1)){
                    return request(pos, +1);
                }
                else if (chunks.after < max && chunks.after < pos + ahead) {
                    return request(chunks.after, +1);
                }
            }
            else if (ahead < 0){

                if (pos > 0 && !(chunks.has(pos) & 2)){
                    return request(pos, -1);
                }
                else if (chunks.before > 0 && chunks.before > pos + ahead) {
                    return request(chunks.before, -1);
                }
            }
        }



        function getRows(count, row, skip){
            preload(count, row, skip);
            let rows = get(count, row, skip);
            rows.forEach(r => emit('row', r));
            return rows;
        }


        on('data', function(data){

            if ('range' in data && data.range.match(/(\d+)-(\d+)\/(\d+)/) && state().getRows !== getRows){

                let start = Number(RegExp.$1),
                    end = Number(RegExp.$2) + 1;

                max = Number(RegExp.$3);
                chunks.add(start, end);
                put({start, end, max, rows: data.rows});
                update({getRows});
            }
        });

    };
}