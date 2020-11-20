const path = require('path');
const replace = require('rollup-plugin-replace');
const rollupLwcCompiler = require('@lwc/rollup-plugin');
const rollupCompat = require('rollup-plugin-compat');

const input = path.resolve(__dirname, '../src/main.js');
const outputDir = path.resolve(__dirname, '../public/js');

function rollupConfig({ format, target }) {
    const isCompat = target === 'es5';
    return {
        input,
        output: {
            file: path.join(outputDir, isCompat ? 'compat.js' : 'main.js'),
            format
        },
        plugins: [
            rollupLwcCompiler(),
            replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
            isCompat && rollupCompat(),
        ].filter(Boolean)
    }
};

module.exports = [
    rollupConfig({ format:'iife', target: 'es5' }),
    rollupConfig({ format:'iife', target: 'es2017' })
];