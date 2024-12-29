import * as fs from "node:fs";
import * as path from "node:path";

const src = path.resolve("./dist/css/");
const dest = path.resolve("../css/");
const files = fs.readdirSync(src);

for (const file of files) {
    console.log(`Copying ${path.join(src, file)} to ${path.join(dest, file)}`);
    fs.copyFileSync(path.join(src, file), path.join(dest, file));
}
