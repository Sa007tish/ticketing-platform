module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },

  env: {
    node: true,
    es2020: true,
  },

  rules: {
    /**
     * ARCHITECTURE GUARDRAIL — PHASE 1 (DETECTION ONLY)
     *
     * Cross-capability imports into another capability's src/**
     * are architectural violations.
     *
     * In Phase 1:
     * - We WARN only (do not fail CI)
     * In Phase 2:
     * - This will be upgraded to ERROR
     */
    "no-restricted-imports": [
      "warn",
      {
        patterns: [
          {
            group: ["capabilities/**/src/**"],
            message:
              "ARCHITECTURE VIOLATION: Cross-capability src import detected. Use public.ts instead.",
          },
        ],
      },
    ],
  },
};
