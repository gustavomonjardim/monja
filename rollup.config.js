import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "es"
  },
  plugins: [babel(), terser()]
};
