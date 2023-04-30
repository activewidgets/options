import {resolve} from 'path';
import testing from '@activewidgets/testing/plugin';

export default {
    plugins: [
        testing('src/**/unit.js')
    ],
    resolve: {
        alias: {
            "@activewidgets/components": "@activewidgets/datagrid/index.js",
            "@activewidgets/options": resolve('./dist/index.js')
        }    
    }
}