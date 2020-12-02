module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double", "avoid-escape"],
    "import/extensions": [
      "error",
      "never",
      {
        js: "always",
      },
    ],
    "max-len": "off",
  },
  noInlineConfig: true,
};
