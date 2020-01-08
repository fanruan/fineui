const { execSync } = require("child_process");
const { resolve } = require("path");
const { writeFileSync } = require("fs");

const packageJSON = require("../../package.json");

packageJSON.version = `2.0.${new Date().getTime()}`;

writeFileSync(resolve(__dirname, "../../package.json"), JSON.stringify(packageJSON, null, 2));

execSync(`npm publish --registry http://192.168.5.154:4873/:_authToken=${process.env.AUTH}`);
