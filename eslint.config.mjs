import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['src/**/*.ts'],
    ignores: ['dist'],
    rules: {
      semi: ['error', 'never'],
      '@typescript-eslint/semi': 'off',
      'no-unexpected-multiline': 'error',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  }
]
