const path = require("path");
module.exports = {
    DEST: path.resolve(__dirname, "../dist"),
    NODE_MODULES: path.resolve(__dirname, "../node_modules"),
    PRIVATE: path.resolve(__dirname, "../private"),
    BABEL_CONFIG: path.resolve(__dirname, "../babel.config.js"),
    TYPESCRIPT: path.resolve(__dirname, "../typescript"),
    ROUTER: path.resolve(__dirname, "../src/router"),
    SRC: path.resolve(__dirname, "../src"),
    DEMO: path.resolve(__dirname, "../demo"),
    PUBLIC: path.resolve(__dirname, "../public"),
    I18N: path.resolve(__dirname, "../i18n"),
    UI: path.resolve(__dirname, "../ui"),
    MOBILE: path.resolve(__dirname, "../_mobile"),
    FIX: path.resolve(__dirname, "../dist/fix"),
};
