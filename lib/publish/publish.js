const { execSync } = require("child_process");
const { resolve } = require("path");
const { writeFileSync } = require("fs");

if (!process.env.PASSWORD) {
    return;
}

const packageJSON = require("../../package.json");

packageJSON.version = `2.0.${new Date().getTime()}`;

writeFileSync(resolve(__dirname, "../../package.json"), JSON.stringify(packageJSON, null, 2));

execSync([
    `npm-cli-login -u fui -p ${process.env.PASSWORD} -e teller@fanruan.com -r http://192.168.5.154:4873/`,
    "npm publish --registry http://192.168.5.154:4873/",
].join(" && "));
