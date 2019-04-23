import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import typescript from 'rollup-plugin-typescript2';
// import { uglify } from "rollup-plugin-uglify";
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
    input: 'src/index.ts',
    output: [{
        file: 'dist/index.js',
        format: 'cjs'
      },{
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'zippyCharts'
      }],
    plugins: [
        typescript(),
        commonjs({
            namedExports: {
                'node_modules/lodash/lodash.js': [
                    'find',
                    'merge'
                ]
            }
        }),
        resolve(),
        serve({
            open: true,
            contentBase: ['','dist']
        }),      // index.html should be in root of project
        livereload({
            watch: 'dist'
          })        
       // uglify()
    ],
    
};