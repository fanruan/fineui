const { resolve } = require("path");
const { execSync } = require("child_process");
const { writeFileSync } = require("fs");

const packageJSON = require("../../package.json");

packageJSON.name = "fineui";

packageJSON.publishConfig.registry = 'https://registry.npmjs.org';

writeFileSync(resolve(__dirname, "../../package.json"), JSON.stringify(packageJSON, null, 2));

execSync('git add dist/');
execSync('git add package.json');
execSync(`git diff-index --quiet HEAD || git commit -am "auto upgrade version to ${packageJSON.version}"`);
