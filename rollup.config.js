
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

let main = {options: 'index.js'};

let umd = {dir: 'dist', entryFileNames: 'ax-[name].umd.js', format: 'umd', sourcemap: true, name: 'ActiveWidgets.Options', extend: true},
    esm = {dir: 'dist', entryFileNames: 'ax-[name].esm.js', format: 'esm', sourcemap: true};

let plugins = [
    resolve(),
    babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [["@babel/env", {modules: false}]]
    })
];

export default [
    {input: main, output: umd, plugins},
    {input: main, output: esm, plugins}
]