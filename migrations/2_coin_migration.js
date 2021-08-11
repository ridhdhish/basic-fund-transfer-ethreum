const CoinMigrations = artifacts.require("Coin");

module.exports = function (deployer) {
  deployer.deploy(CoinMigrations);
};
