const { roots, ...config } = require("../../jest.config");
module.exports = Object.assign(config, { roots: roots.concat(["demo"]) });
