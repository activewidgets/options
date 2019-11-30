
export default function(name, params){

    if (typeof name != 'string' || typeof params != 'object'){
        throw new Error('incorrrect/missing arguments');
    }

    function copy(source, target){
        for(let i in source){
            if (typeof source[i] == 'object'){
                if (typeof target[i] != 'object'){
                    target[i] = {};
                }
                copy(source[i], target[i]);
            }
            else {
                target[i] = source[i];
            }
        }
    }

    return function({state}){

        let {types} = state();

        if (!types[name]){
            types[name] = {};
        }

        let type = types[name];

        if (!type.formats){
            type.formats = {};
        }

        copy(params, type);
    };
}