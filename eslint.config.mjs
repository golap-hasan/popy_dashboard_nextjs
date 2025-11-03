import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-unused-vars": ["error", { "args": "none" }],
      "no-console": "warn",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      // "curly": ["error", "all"],
      "no-multiple-empty-lines": ["warn", { "max": 1, "maxEOF": 1 }],
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      "comma-spacing": ["warn", { "before": false, "after": true }],
      "semi": ["warn", "always"],
      "quotes": ["warn", "double"],
      "indent": ["warn", 2, { "SwitchCase": 1 }],
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
