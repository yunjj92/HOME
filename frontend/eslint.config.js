import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        // TypeScript 타입 기반 lint를 위해 tsconfig 연결
        project: ['./tsconfig.eslint.json'],
      },
    },
    rules: {
      // 사용하지 않는 변수 검사
      // "_" 로 시작하는 변수는 의도적 무시 허용
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // any 타입 사용 경고
      '@typescript-eslint/no-explicit-any': 'warn',

      // console 사용 경고
      'no-console': 'warn',

      // React Hook 규칙
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React Fast Refresh 규칙
      'react-refresh/only-export-components': 'warn',
    },
  },
  {
    files: ['vite.config.ts', 'vitest.config.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
])
