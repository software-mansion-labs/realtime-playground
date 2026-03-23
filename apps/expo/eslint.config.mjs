import { base } from '../../eslint.base.mjs'

export default [
  ...base,
  {
    ignores: ['.expo/', 'build/', 'out/', 'metro.config.js', 'babel.config.js'],
  },
]
