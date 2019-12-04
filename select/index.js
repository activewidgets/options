
export default function(){
    return function({on, emit, cls}){

        let selected = 0;

        on('mouse', function({row}){
            selected = row.start;
            emit('refresh', 'rows');
        });

        on('row', function(row){
            if (row.start == selected){
                //row.style = {'background': '#009'};
                row[cls] = (row[cls] ? row[cls] + ' ' : '') + 'ax-selected';
            }
        });
    }
}