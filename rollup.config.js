import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'components/sync-sheet-field.js',
    output: {
      file: 'dist/sync-sheet-field.js',
      format: 'cjs'
    },
    plugins: [
      resolve()
    ]
  },
  {
    input: 'components/sync-sheet-field.js',
    output: {
      file: 'dist/sync-sheet-field.min.js',
      format: 'cjs'
    },
    plugins: [
      resolve(),
      terser()
    ]
  },
  {
    input: 'components/sync-sheet-box.js',
    output: {
      file: 'dist/sync-sheet-box.js',
      format: 'cjs'
    },
    plugins: [
      resolve()
    ]
  },
  {
    input: 'components/sync-sheet-box.js',
    output: {
      file: 'dist/sync-sheet-box.min.js',
      format: 'cjs'
    },
    plugins: [
      resolve(),
      terser()
    ]
  }
]
