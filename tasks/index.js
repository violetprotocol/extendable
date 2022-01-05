const call = require("./call");
const callApp = require("./call-app");
const extend = require("./extend")
const getExtensions = require("./extend-getExtensionAddresses")
const deploy = require("./deploy")
const deployApp = require("./deploy-app")
const replace = require("./replace")
const accounts = require("./accounts");

module.exports = { accounts, extend, getExtensions, replace, deploy, deployApp, call, callApp };
