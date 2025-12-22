export default [
  {
    files: ["**/*.ts", "**/*.js"],

    rules: {
      /**
       * ARCHITECTURE GUARDRAIL — PHASE 1 (DETECTION ONLY)
       *
       * Cross-capability imports into another capability's src/**
       * are architectural violations.
       *
       * Phase 1: warn only
       * Phase 2: upgrade to error
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
  },
];
