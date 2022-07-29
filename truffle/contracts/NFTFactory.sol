// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// Importer contrats : ERC1155, ERC721, VRB de Chainlink
import "./NFTGeneration.sol";

contract NFTFactory {
    event NFTCollectionCreated(string _creator, address _collectionAddress, uint _timestamp, uint _totalSupply);

    function createCollection (string calldata _creator, string calldata _uri, uint _totalSupply, uint _id, uint256 _amount, bytes memory _data /** Ajouter des strings pour les attributs ? et des uint pour les echelles d'aleatoires des attributs ? */) external returns(address){
        NFTGeneration collection = new NFTGeneration(_uri); // Ou utiliser create2 en yul
        NFTGeneration(collection).mint(msg.sender, _id, _amount, _data ); // EN TRAVAIL
        // Ajouter ici les attributs
        emit NFTCollectionCreated(_creator, address(collection), block.timestamp);
    }
}