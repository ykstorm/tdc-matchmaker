import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { plugin as shadcn } from "@shadcn/lint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.tsx"],
    plugins: { shadcn },
    rules: {
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-restyle": "error",
    },
  },
  {
    // The primitives are upstream shadcn code. They own their exact values,
    // like ring-[3px], so the arbitrary-value rule applies to our code only.
    files: ["src/components/ui/**"],
    rules: { "shadcn/no-arbitrary-values": "off" },
  },
  {
    rules: {
      complexity: ["error", 10],
      "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["error", { max: 40, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // shadcn primitives are vendored code, and test fixtures are data.
    files: ["src/components/ui/**", "tests/**"],
    rules: { "max-lines-per-function": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
