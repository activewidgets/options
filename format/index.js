
export default function(name, format){
    return function({on}){
        on('column', null, column => {
            if (column.format === name){
                column.format = format;
            }
        });
    };
}
