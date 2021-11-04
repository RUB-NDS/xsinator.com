import {terser} from 'rollup-plugin-terser';
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default [
    {
        input: './src/index.js',
        output: [
            {
                file: "./app/static/js/index.min.js",
                format: "es",
                plugins: [terser()]
            },
        ],
        plugins: [nodeResolve()]
    }, 
    {
        input: './src/testing.js',
        output: [
            {
                file: "./app/static/js/testing.min.js",
                format: "es",
                plugins: [terser()]
            },
        ],
        plugins: [nodeResolve()]
    }
]