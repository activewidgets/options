
export default function(name, fn){
    return function({on}){
        on('column', null, column => {
            if (column.convert === name){
                column.convert = fn;
            }
        });
    };
}
