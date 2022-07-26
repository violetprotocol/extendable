const callMock = require("./call-mock");
const callApp = require("./call-app");
const extend = require("./extend")
const getExtensions = require("./extend-getExtensionAddresses")
const deploy = require("./deploy")
const deployerc165 = require("./deploy-erc165")
const deployApp = require("./deploy-app")
const replace = require("./replace")
const accounts = require("./accounts");

module.exports = { accounts, extend, getExtensions, replace, deploy, deployerc165, deployApp, callMock, callApp };
