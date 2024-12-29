import path from "node:path";
import { fileURLToPath } from "node:url";
import { babel } from "@rollup/plugin-babel";
import banner from "./banner.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const destinationFile = "darkmode";
const plugins = [
    babel({
        // Only transpile our source code
        exclude: "node_modules/**",
        // Include the helpers in the bundle, at most one copy of each
        babelHelpers: "bundled",
    }),
];
const globals = [];

const rollupConfig = {
    input: path.resolve(__dirname, "../js/darkmode.js"),
    output: {
        banner: banner(),
        file: path.resolve(__dirname, `../dist/js/${destinationFile}.js`),
        format: "umd",
        globals,
        generatedCode: "es2015",
        name: "darkmode",
    },
    plugins,
};

export default rollupConfig;
