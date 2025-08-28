import js from '@eslint/js';
import nextPlugin from 'eslint-config-next';

export default [
  js.configs.recommended,
  ...nextPlugin.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      'src/generated/**/*',
      '.next/**/*',
      'node_modules/**/*',
      'dist/**/*',
      'build/**/*'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@next/next/no-html-link-for-pages': 'error'
    }
  }
];
