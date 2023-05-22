module.exports = {
  extends: ['plugin:vue/essential', 'eslint:recommended', 'prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    semi: ['error', 'always'],
    'no-console': 'off',
    'vue/valid-v-slot': 'off'
  },
  env: {
    node: true
  }
};
