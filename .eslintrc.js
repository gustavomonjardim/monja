module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "no-unused-vars": ["error", { "varsIgnorePattern": "Monja" }],
    "no-console": "off",
  },
  ignorePatterns: ["dist/", "node_modules/"],
};
