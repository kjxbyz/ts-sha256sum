import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  format: ["cjs", "esm"],
  dts: true,
  tsconfig: "./tsconfig.json",
  banner: {
    js: "/** Copyright (c) 2024 kjxbyz. All rights reserved. */",
  },
});
