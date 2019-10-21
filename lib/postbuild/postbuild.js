const Concat = require("concat-with-sourcemaps");
const { resolve } = require("path");
const fs = require("fs");

function unionJs(filenames) {
    const filename = filenames[0];

    var concat = new Concat(true, filename, "\n");

    filenames.forEach(filename => {
        concat.add(
            filename,
            fs.readFileSync(resolve(__dirname, `../../dist/${filename}`)),
            fs.readFileSync(resolve(__dirname, `../../dist/${filename}.map`)).toString()
        );
    });

    concat.add(null, `//# sourceMappingURL=${filename}.map`);
    
    var concatenatedContent = concat.content;
    var sourceMapForContent = concat.sourceMap;
    
    fs.writeFileSync(resolve(__dirname, "../../dist", filename), concatenatedContent, {
        encoding: "utf8",
    });
    
    fs.writeFileSync(resolve(__dirname, "../../dist", `${filename}.map`), sourceMapForContent, {
        encoding: "utf8",
    });
}

unionJs(["bundle.min.js", "fineui.typescript.js"]);
unionJs(["bundle.ie.min.js", "fineui.typescript.ie.js"]);
unionJs(["fineui.min.js", "fineui.typescript.js"]);
unionJs(["fineui.ie.min.js", "fineui.typescript.ie.js"]);
// unionJs(["bundle.min.js", "fineui.typescript.js"]);
