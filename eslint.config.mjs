import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['.yarn/**', 'node_modules/**', '**/node_modules/**'],
  },
  {
    files: ['packages/**/*.ts', 'packages/**/*.tsx'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettier],
    rules: {
      'require-await': 'warn',
    },
  },
)
