
export default function(name, params){

    if (typeof name != 'string' || typeof params != 'object'){
        throw new Error('incorrrect/missing arguments');
    }


    function applyStyle(target, source){
        for (let i in source){
            if (!(i in target)){
                target[i] = source[i];
            }
        }
    }


    return function({on, cls}){

        on('column', null, column => {

            if (column.type !== name){
                return;
            }

            for (let i in params){
                if (i == 'style'){
                    applyStyle(column.style, params.style);
                }
                else if (i == cls && (cls in column)){
                    column[cls] += ' ' + params[cls];
                }
                else if (!(i in column)){
                    column[i] = params[i];
                }
            }
        });
    };
}