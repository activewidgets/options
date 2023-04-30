import {defineConfig, build} from 'vite';
import fs from 'fs';

let pkg = JSON.parse(fs.readFileSync('package.json', {encoding:'utf8'}));

let banner = `/**
 * ${pkg.name} ${pkg.version}
 * Copyright (C) 2023 ActiveWidgets SARL. All Rights Reserved.
 * This code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this package.
 */
`;

await build(defineConfig({
    configFile: false,
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        reportCompressedSize: false,
        lib : {
            entry: './src/index.js',
            formats: ['es'],
            fileName: 'index'
        }
    },
    esbuild: {
        banner
    }
}));
