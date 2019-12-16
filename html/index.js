
import type from '../type/index.js';

export default function(){

    function format(v){
        let output = [];
        output.__html = v;
        return output;
    }

    return type('html', {template: 'html', formats: {default: format}});
}
