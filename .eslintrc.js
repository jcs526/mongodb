module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: "eslint:recommended",
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        ".eslintrc.{js,cjs}"
      ],
      parserOptions: {
        sourceType: "script"
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest"
  },
  rules: {
    "no-console": ["error", { allow: ["warn", "error"] }],
    quotes: ["error", "double"],
    "quote-props": ["error", "as-needed"],
    semi: ["error", "always"],
    indent: ["error", 2, { SwitchCase: 1 }],
    "comma-spacing": ["error", { before: false, after: true }],
    "comma-dangle": ["error", "only-multiline"],
    "max-len": ["error", { code: 80, ignoreUrls: true }],
    "object-curly-spacing": ["error", "always"],
    "arrow-parens": ["error", "as-needed"],
    "prefer-const": "error",
    "no-var": "error"
  }
};
