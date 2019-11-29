
export default function(params){
    return function({state}){

        let {defaults} = state();

        if (!defaults.row){
            defaults.row = {};
        }

        let i, row = defaults.row;

        for(i in params){
            row[i] = params[i];
        }
    }
}