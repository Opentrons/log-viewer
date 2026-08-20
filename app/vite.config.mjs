import react from "@vitejs/plugin-react"
import postCssImport from "postcss-import"
import postCssPresetEnv from "postcss-preset-env"
import { defineConfig } from "vite"
export const cssModuleSideEffect = () => {
  return {
    name: "css-module-side-effectful",
    enforce: "post",
    transform(_, id) {
      if (id.includes(".module.")) {
        return {
          moduleSideEffects: "no-treeshake", // or true, which also works with slightly better treeshake
        }
      }
    },
  }
}
export default defineConfig(async () => {
  return {
    base: "",
    build: {
      outDir: "lib",
      sourcemap: true,
    },
    plugins: [react({ include: "**/*.tsx*/" }), cssModuleSideEffect()],
    css: {
      postcss: {
        plugins: [postCssImport({ root: "./src/" }), postCssPresetEnv({ stage: 0 })],
      },
    },
  }
})
