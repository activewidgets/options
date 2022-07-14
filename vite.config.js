import {resolve} from 'path';
import testing from '@activewidgets/testing/plugin';

export default {
    plugins: [
        testing('*/unit.js')
    ],
    resolve: {
        alias: {
            "@activewidgets/components": "@activewidgets/datagrid",
            "@activewidgets/options": resolve('./index.js')
        }    
    }
}