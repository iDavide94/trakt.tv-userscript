import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'

const format = 'iife'
const name = 'Trakt'

export default [
  {
    input: 'src/trakt.js',
    output: [
      {
        file: './dist/index.js',
        format,
        name,
        plugins: [
          terser({
            compress: false,
            mangle: false,
            output: {
              beautify: true
            }
          })
        ]
      },
      {
        file: './dist/index.min.js',
        format,
        name,
        plugins: [
          terser({
            compress: true,
            mangle: true,
            output: {}
          })
        ]
      }
    ],
    plugins: [json({})]
  }
]
