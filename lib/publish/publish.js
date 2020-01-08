const { execSync } = require("child_process");

execSync(`npm publish --tag 2.0.${new Date().getTime()}`);
