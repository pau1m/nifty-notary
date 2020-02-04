const Migrations = artifacts.require("Migrations");
const Notary = artifacts.require("Notary");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Notary);
};

// post deployment... authorise a
