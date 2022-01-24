
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import fs from 'fs';
import path from 'path';
import rootpkg from './package.json';


let globals = {
    '@activewidgets/experimental': 'ActiveWidgets.Experimental'
};


let getBanner = name => `/**
 * ${name} ${rootpkg.version}
 * Copyright (C) 2022 ActiveWidgets SARL. All Rights Reserved.
 * This code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this package.
 */
`;


function keepBanner(node, comment){
    if (comment.type == "comment2") {
        return /2022 ActiveWidgets/.test(comment.value);
    }
}


let plugins = [
    resolve(),
    babel({
        babelrc: false,
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [["@babel/env", {modules: false}]]
    }),
    terser({
        output: {comments: keepBanner}
    })
];


function read(filename){
    return String(fs.readFileSync(filename, {encoding:'utf8'}));
}


function config(name, input){

    let dir = path.dirname(input),
        pkg = JSON.parse(read(path.join(dir, 'package.json'))),
        main = path.join(dir, pkg.main),
        module = path.join(dir, pkg.module),
        sourcemap = true,
        banner = getBanner(pkg.name),
        extend = true;

    return {
        input,
        output: [
            {file: main, format: 'umd', sourcemap, banner, globals, name, extend},
            {file: module, format: 'esm', sourcemap, banner}
        ],
        external: Object.keys(globals),
        plugins
    };
}


export default config('ActiveWidgets.Options', 'index.js');