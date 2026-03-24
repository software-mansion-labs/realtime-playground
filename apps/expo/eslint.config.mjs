import tseslint from 'typescript-eslint'
import { base } from '../../eslint.base.mjs'

export default tseslint.config(...base, {
  ignores: ['.expo/', 'build/', 'out/', 'metro.config.js', 'babel.config.js'],
})
