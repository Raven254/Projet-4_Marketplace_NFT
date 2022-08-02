const NFTFactory = artifacts.require("NFTFactory");

module.exports = function (deployer) {
  deployer.deploy(NFTFactory);
};
