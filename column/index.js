
export default function(params){
    return function({state}){

        let {defaults} = state();

        if (!defaults.column){
            defaults.column = {};
        }

        let i, column = defaults.column;

        for(i in params){
            column[i] = params[i];
        }
    }
}