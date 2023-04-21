
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import path from 'path';

let rootpkg = JSON.parse(read('./package.json'));


let globals = {
    '@activewidgets/experimental': 'ActiveWidgets.Experimental'
};


let getBanner = name => `/**
 * ${name} ${rootpkg.version}
 * Copyright (C) 2023 ActiveWidgets SARL. All Rights Reserved.
 * This code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this package.
 */
`;


function keepBanner(node, comment){
    if (comment.type == "comment2") {
        return /2023 ActiveWidgets/.test(comment.value);
    }
}


let plugins = [
    resolve(),
    terser({
        output: {comments: keepBanner}
    })
];


function read(filename){
    return String(fs.readFileSync(filename, {encoding:'utf8'}));
}


function config(input){

    let dir = path.dirname(input),
        pkg = JSON.parse(read(path.join(dir, 'package.json'))),
        main = path.join(dir, pkg.main),
        sourcemap = true,
        banner = getBanner(pkg.name);

    return {
        input,
        output: [
            {file: main, format: 'esm', sourcemap, banner}
        ],
        external: Object.keys(globals),
        plugins
    };
}


export default config('index.js');