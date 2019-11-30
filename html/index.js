
import type from '../type';

export default function(){

    function format(v){
        let output = [];
        output.__html = v;
        return output;
    }

    return type('html', {template: 'html', formats: {default: format}});
}
