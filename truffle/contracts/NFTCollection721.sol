// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

// Importer VRF de Chainlink
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection721 is ERC721, ERC721URIStorage, Ownable {
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {} // A adapter avec les inputs
    uint256 public tokenIds;


    function _baseURI() internal pure override returns (string memory) {
       // en construction
    }

    function safeMint(address _to, uint256 _tokenId, string memory _uri)
        public
        onlyOwner
    {
        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, _uri);
        tokenIds += 1;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}