const { resolve } = require("path");
const { writeFileSync } = require("fs");

if (!process.env.VERDACCIO_AUTH) {
    return;
}

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

packageJSON.version = `2.0.${version}`;

writeFileSync(resolve(__dirname, "../../package.json"), JSON.stringify(packageJSON, null, 2));

writeFileSync(resolve(__dirname, "../../.npmrc"), `//192.168.5.154:4873/:_authToken="${process.env.VERDACCIO_AUTH}"`);
