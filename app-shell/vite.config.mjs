import { defineConfig } from "vite"
export default defineConfig(async () => {
  return {
    // this makes imports relative rather than absolute
    base: "",
    publicDir: false,
    build: {
      // Relative to the root
      ssr: "src/main.ts",
      outDir: "lib",
      commonjsOptions: {
        transformMixedEsModules: true,
        esmExternals: true,
        exclude: [/node_modules/],
      },
      lib: {
        entry: {
          main: "src/main.ts",
          preload: "src/preload.ts",
        },
        formats: ["cjs"],
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "CommonJs",
      },
      exclude: ["node_modules"],
    },
  }
})
