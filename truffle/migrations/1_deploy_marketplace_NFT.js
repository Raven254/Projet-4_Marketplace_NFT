const MarketplaceNFT = artifacts.require("MarketplaceNFT");

module.exports = function (deployer) {
  deployer.deploy(MarketplaceNFT);
};
