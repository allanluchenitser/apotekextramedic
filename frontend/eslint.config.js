import { tresLintConfig } from '@tresjs/eslint-config'

export default tresLintConfig({

}, {
  rules: {
    'curly': 'off',
    'eol-last': 'off',
    'no-console': 'off',
    'no-useless-return': 'off',

    'antfu/if-newline': 'off',
    'antfu/consistent-list-newline': 'off',

    'unicorn/number-literal-case': 'off',

    'format/prettier': 'off',
    'jsonc/sort-keys': 'off',
    'perfectionist/sort-named-imports': 'off',

    'ts/consistent-type-definitions': 'off',

    'style/semi': 'off',
    'style/max-statements-per-line': 'off',
    'style/member-delimiter-style': 'off',
    'style/no-tabs': 'off',
    'style/indent': 'off',
    'style/space-in-parens': 'off',

    'style/quotes': 'off',
    'style/arrow-parens': 'off',
    'style/eol-last': 'off',
    'style/no-trailing-spaces': 'off',
    'style/comma-dangle': 'off',
    'style/padded-blocks': 'off',
    'style/brace-style': 'off',

    'vue/block-tag-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/prefer-separate-static-class': 'off',
    'vue/html-indent': 'off',
    'vue/html-self-closing': 'off',
    'vue/attributes-order': 'off'
  },
})
