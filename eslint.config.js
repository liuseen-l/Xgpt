import antfu from '@antfu/eslint-config'
import tsParser from '@typescript-eslint/parser'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginReactRefresh from 'eslint-plugin-react-refresh'
import { isPackageExists } from 'local-pkg'

const ReactRefreshAllowConstantExportPackages = [
  'vite',
]
const isAllowConstantExport = ReactRefreshAllowConstantExportPackages.some(
  i => isPackageExists(i),
)

const GLOB_JS = '**/*.?([cm])js'
const GLOB_JSX = '**/*.?([cm])jsx'
const GLOB_TS = '**/*.?([cm])ts'
const GLOB_TSX = '**/*.?([cm])tsx'

export default antfu({
  typescript: true,
  react: false,
  vue: false,
  jsonc: false,
  yaml: false,
}, {
  plugins: {
    'react': pluginReact,
    'react-hooks': pluginReactHooks,
    'react-refresh': pluginReactRefresh,
  },
  files: [
    GLOB_JS,
    GLOB_TS,
    GLOB_JSX,
    GLOB_TSX,
  ],
  ignores: ['dist'],
  linterOptions: {
    noInlineConfig: true,
    reportUnusedDisableDirectives: true,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    parser: tsParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // recommended rules react-hooks
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',

    // react refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: isAllowConstantExport },
    ],

    // recommended rules react
    'react/display-name': 'error',
    'react/jsx-key': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-target-blank': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-children-prop': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unknown-property': 'off',
    'react/no-unsafe': 'off',
    'react/prop-types': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/require-render-return': 'error',

    // custom
    'react-hooks/rules-of-hooks': 'off',
    'no-console': 'off',
    'unicorn/prefer-dom-node-text-content': 'off',

  },
})
