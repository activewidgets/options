
import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import fs from 'fs';
import path from 'path';


let plugins = [
    resolve(),
    babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [["@babel/env", {modules: false}]]
    }),
    terser()
];


function read(filename){
    return String(fs.readFileSync(filename, {encoding:'utf8'}));
}


function expand({name, input}){

    let dir = path.dirname(input),
        pkg = JSON.parse(read(path.join(dir, 'package.json'))),
        main = path.join(dir, pkg.main),
        module = path.join(dir, pkg.module),
        browser = path.join('dist', path.basename(pkg.name) + '.js'),
        sourcemap = true,
        extend = true;

    return {
        input,
        output: [
            {file: main, format: 'cjs', sourcemap},
            {file: module, format: 'esm', sourcemap},
            {file: browser, format: 'umd', sourcemap, name, extend}
        ],
        plugins
    };
}


function config(name, input){

    let re = /default as (\w+).+'(.+)'/;

    return read(input)
        .split('\n')
        .map(s => s.match(re) ? {name: name + '.' + RegExp.$1, input: RegExp.$2} : null)
        .filter(x => !!x)
        .concat({name, input})
        .map(expand);
}


export default config('ActiveWidgets.Options', 'index.js');