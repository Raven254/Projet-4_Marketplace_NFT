// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

// Importer VRF de Chainlink
import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract NFTCollection1155 is ERC1155, Ownable, ERC1155Supply {
    constructor(string memory _uri) ERC1155(_uri) {} // régler le problème du constructor

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    // Les fonctions suivantes sont des overrides requis par Solidity. Permet le suivi de la supply globale, à voir si on garde.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
