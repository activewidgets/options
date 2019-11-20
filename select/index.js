
export default function(){
    return function({props, state, update, on, emit, cls}){

        let selected = 0;

        on('mouse', function({row}){
            selected = row.start;
            update({refresh: {}});
        });

        on('row', function(row){
            if (row.start == selected){
                //row.style = {'background': '#009'};
                row[cls] = (row[cls] ? row[cls] + ' ' : '') + 'ax-selected';
            }
        });
    }
}