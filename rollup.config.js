import resolve from 'rollup-plugin-node-resolve'
import image from '@rollup/plugin-image'

export default [
  {
    input: 'components/components.js',
    output: {
      file: 'dist/components.js',
      format: 'cjs'
    },
    plugins: [
      resolve(),
      image()
    ]
  }
]
