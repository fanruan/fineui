const { resolve } = require("path");
const { writeFileSync } = require("fs");

if (!process.env.VERDACCIO_AUTH) {
    return;
}

const packageJSON = require("../../package.json");

packageJSON.version = `2.0.${new Date().getTime()}`;

writeFileSync(resolve(__dirname, "../../package.json"), JSON.stringify(packageJSON, null, 2));

writeFileSync(resolve(__dirname, "../../.npmrc"), `//192.168.5.154:4873/:_authToken="${process.env.VERDACCIO_AUTH}"`);
