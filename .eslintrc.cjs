/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  // CRA already sets parser + TS handling via react-app, but adding this is safe
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  extends: [
    // CRA baseline (includes react, hooks, jsx-a11y, import, etc.)
    "react-app",
    "react-app/jest",

    // IMPORTANT: keep this LAST to disable ESLint stylistic rules
    // that conflict with Prettier formatting
    "prettier",
  ],
  rules: {
    /**
     * ✅ "Correctness" rules you may want stricter than CRA defaults.
     * Keep these conservative; CRA already enforces a lot.
     */

    // CRA handles React 17+ JSX transform; don't require React in scope
    "react/react-in-jsx-scope": "off",

    // If you're on TS, this helps prevent unsafe patterns (optional)
    // CRA's config already catches many cases; keep as warning to start
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // Example: unused vars is handled by TS/CRA; this avoids noisy false positives
    // If you see duplicate warnings, you can disable one side later.
    "no-unused-vars": "off",
  },
  ignorePatterns: [
    "node_modules/",
    "build/",
    "dist/",
    "coverage/",
  ],
};
