import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "LitsEditor",
      formats: ["es", "umd"],
      fileName: (format) => `lits-editor.${format === "es" ? "js" : "umd.js"}`,
    },
    rollupOptions: {
      external: ["@mojir/lits"],
      output: {
        globals: {
          "@mojir/lits": "Lits",
        },
      },
    },
  },
  server: {
    open: "/demo/index.html",
  },
});
