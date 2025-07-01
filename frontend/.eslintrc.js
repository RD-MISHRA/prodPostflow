// C:\Users\Ratnadeep\Desktop\postflow\frontend\.eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  // This is KEY for Vue SFCs
  parser: 'vue-eslint-parser',
  parserOptions: {
    // This is KEY for modern JavaScript (imports, etc.)
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020, // Or higher (2021, 2022, etc.) depending on your JS version target
    sourceType: 'module',
    requireConfigFile: false, // Keep this for now unless you have a specific babel.config.js
  },
  extends: [
    'eslint:recommended',
    // Choose the correct Vue recommended rules based on your Vue version:
    // Assuming Vue 3 for a modern project:
    'plugin:vue/vue3-recommended',
    // If your project is Vue 2:
    // 'plugin:vue/recommended',
  ],
  plugins: [
    'vue',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // You might need to add this rule if you frequently use single-word component names (e.g., 'App', 'Footer')
    // 'vue/multi-word-component-names': 'off',
  },
};