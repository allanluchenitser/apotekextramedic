import { tresLintConfig } from '@tresjs/eslint-config'

export default tresLintConfig({

}, {
  rules: {
    'style/max-statements-per-line': 'off',
    'vue/html-indent': 'off',
    'eol-last': 'off',
    'vue/block-tag-newline': 'off',
    'style/semi': 'off',
    'format/prettier': 'off',
    'jsonc/sort-keys': 'off',
    'antfu/consistent-list-newline': 'off',
    'perfectionist/sort-named-imports': 'off',
    'style/member-delimiter-style': 'off',
    'vue/prefer-separate-static-class': 'off',
    'vue/html-self-closing': 'off',
  },
})
