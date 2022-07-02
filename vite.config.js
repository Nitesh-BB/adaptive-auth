import { build, defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // build: {
  //   lib: {
  //     entry: path.resolve(__dirname, "src/main.jsx"),
  //     name: "Adaptive",
  //     formats: ["es", "umd"],
  //     fileName: (format) => `adaptive.${format}.js`,
  //   },
  // },
});
