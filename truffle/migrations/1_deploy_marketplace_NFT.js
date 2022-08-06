const NFTFactory = artifacts.require("NFTFactory");
const MarketplaceNFT = artifacts.require("MarketplaceNFT");

module.exports = function (deployer) {
  deployer.deploy(NFTFactory).then(function(){
    return deployer.deploy(MarketplaceNFT, 25, "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe");
  });
};
