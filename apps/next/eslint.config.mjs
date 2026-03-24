import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import { defineConfig, globalIgnores } from 'eslint/config'
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
  // Override default ignores of eslint-config-next.
  globalIgnores([
    'node_modules/**',
    '**/node_modules/**',
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
