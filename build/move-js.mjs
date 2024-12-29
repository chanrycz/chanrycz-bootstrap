import * as fs from "node:fs";
import * as path from "node:path";

const src = path.resolve("./dist/js/");
const dest = path.resolve("../js/");
const bootstrapDest = path.resolve("../plugins/bootstrap/js/");
const files = fs.readdirSync(src);

for (const file of files) {
    if (file.startsWith("bootstrap")) {
        console.log(
            `Copying ${path.join(src, file)} to ${path.join(
                bootstrapDest,
                file
            )}`
        );
        fs.copyFileSync(path.join(src, file), path.join(bootstrapDest, file));
    } else {
        console.log(
            `Copying ${path.join(src, file)} to ${path.join(dest, file)}`
        );
        fs.copyFileSync(path.join(src, file), path.join(dest, file));
    }
}
