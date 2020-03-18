const Migrations = artifacts.require("Migrations");
// const config = require(__dirname+'./../config');

module.exports = (deployer) => {
  deployer.then(async () => {
    await deployer.deploy(Migrations);
  })
};