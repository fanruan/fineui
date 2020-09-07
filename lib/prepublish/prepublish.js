const { resolve } = require("path");
const { writeFileSync } = require("fs");

function pad2(n) {// always returns a string
    return (n < 10 ? "0" : "") + n;
}

const d = new Date();

const version = d.getFullYear() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    pad2(d.getHours()) +
    pad2(d.getMinutes()) +
    pad2(d.getSeconds());

const packageJSON = require("../../package.json");

const versionChars = packageJSON.version.split(".");

versionChars[versionChars.length - 1] = version;

packageJSON.version = versionChars.join(".");

packageJSON.publishConfig.registry = 'https://npm.fineres.com/';

packageJSON.name = "@fui/core";

writeFileSync(resolve(__dirname, "../../package.json"), JSON.stringify(packageJSON, null, 2));
