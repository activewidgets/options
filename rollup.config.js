
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

let main = {options: 'index.js'};

let globals = {};

let umd = {dir: 'dist', entryFileNames: 'ax-[name].js', format: 'umd', sourcemap: true, name: 'ActiveWidgets.options', extend: true, globals},
    esm = {dir: 'dist', entryFileNames: 'ax-[name].esm.js', format: 'esm', sourcemap: true};

let external = Object.keys(globals);

let plugins = [
    resolve(),
    babel({
        babelrc: false,
        exclude: 'node_modules/**',
        presets: [["@babel/env", {modules: false}]]
    })
];

export default [
    {input: main, output: umd, external, plugins},
    {input: main, output: esm, external, plugins}
]