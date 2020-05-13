import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";
import sourcemaps from "rollup-plugin-sourcemaps";

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true
  },
  plugins: [babel(), sourcemaps(), terser()]
};
