const NFTFactory = artifacts.require("NFTFactory");
const MarketplaceNFT = artifacts.require("MarketplaceNFT");

module.exports = function (deployer) {
  deployer.deploy(NFTFactory).then(function(){
    return deployer.deploy(MarketplaceNFT, 25, "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe");
  });
};
