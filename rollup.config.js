import resolve from 'rollup-plugin-node-resolve'

export default [
  {
    input: 'components/components.js',
    output: {
      file: 'dist/components.js',
      format: 'cjs'
    },
    plugins: [
      resolve()
    ]
  }
]
