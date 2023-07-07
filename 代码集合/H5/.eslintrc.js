module.exports = {
  root: false,
  env: {
    browser: false,
    node: false
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    "space-before-function-paren":0,
    'generator-star-spacing': 0
  }
}
