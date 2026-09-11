import { tresLintConfig } from '@tresjs/eslint-config'

export default tresLintConfig({

}, {
  rules: {
    'curly': 'off',
    'eol-last': 'off',

    'antfu/if-newline': 'off',
    'antfu/consistent-list-newline': 'off',

    'style/semi': 'off',
    'format/prettier': 'off',
    'jsonc/sort-keys': 'off',
    'perfectionist/sort-named-imports': 'off',

    'style/max-statements-per-line': 'off',
    'style/member-delimiter-style': 'off',
    'style/no-tabs': 'off',
    'style/indent': 'off',

    'style/quotes': 'off',
    'style/arrow-parens': 'off',
    'style/eol-last': 'off',
    'style/no-trailing-spaces': 'off',

    'vue/block-tag-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/prefer-separate-static-class': 'off',
    'vue/html-indent': 'off',
    'vue/html-self-closing': 'off',
  },
})
