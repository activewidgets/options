
export default function(){
    return function({state}){

        let {types} = state();

        if (!types.html){
            types.html = {formats: {}};
        }

        types.html.template = 'html';
        types.html.formats.default = function(v){
            let output = [];
            output.__html = v;
            return output;
        }
    };
}