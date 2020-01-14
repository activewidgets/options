
export default function(params){

    if (typeof params != 'object'){
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

        on('row', null, row => {

            for (let i in params){
                if (i == 'style'){
                    applyStyle(row.style, params.style);
                }
                else if (i == cls && (cls in row)){
                    row[cls] += ' ' + params[cls];
                }
                else if (!(i in row)){
                    row[i] = params[i];
                }
            }
        });
    };
}