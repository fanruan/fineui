const path = require("path");
module.exports = {
    DEST: path.resolve(__dirname, "../dist"),
    NODE_MODULES: path.resolve(__dirname, "../node_modules"),
    PRIVATE: path.resolve(__dirname, "../private"),
    BABEL_CONFIG: path.resolve(__dirname, "../babel.config.js"),
    IE8_BABEL_CONFIG: path.resolve(__dirname, "../babel.config.ie8.js"),
    TYPESCRIPT: path.resolve(__dirname, "../typescript"),
};
