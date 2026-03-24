import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { base } from '../../eslint.base.mjs'

const eslintConfig = defineConfig([
  ...base,
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'require-await': 'warn',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
])

export default eslintConfig
