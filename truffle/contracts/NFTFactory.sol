// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// Importer contrats : IERC1155, IERC721, VRB de Chainlink
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./NFTCollection721.sol";

contract NFTFactory is ReentrancyGuard {

    mapping (string => bool) uriExistsdMap;
    mapping (string => bool) nameExistsMap;
    mapping (string => bool) symbolExistsdMap;

    // ::::::::::::: NFT FACTORY ::::::::::::: //

    ///@notice Permet à l'utilisateur de créer une nouvelle collection et de mint un premier NFT.
    ///@param _name Nom de la collection NFT à créer.
    ///@param _symbol Symbole de la collection NFT à créer.
    ///@param _uri Uri du NFT à mint avec la nouvelle collection.
    function createCollection(string calldata _name, string calldata _symbol, string calldata _uri) external returns(NFTCollection721) {       
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")), unicode"Vous devez donner un nom à votre collection");
        require(bytes(_uri).length > 0, "Vous devez fournir une image");
        require(nameExistsMap[ _name] != true, unicode'Ce nom existe déjà.');
        require(symbolExistsdMap[ _symbol] != true, unicode'Ce symbole existe déjà.');        
        require(uriExistsdMap[ _uri] != true, unicode'Cet URI existe déjà.');
        
        NFTCollection721 collection = new NFTCollection721(_name, _symbol); // Ou utiliser create2

        collection.transferOwnership(msg.sender);
        nameExistsMap[ _name] = true;
        symbolExistsdMap[ _symbol] = true;
        uriExistsdMap[ _uri] = true;

        return(NFTCollection721(collection));
    }
    
    ///@notice Mint un NFT d'une collection déjà existante à partir d'une clé et d'un uri.
    ///@param _collectionAddress Adresse de la collection.
    ///@param _uri URI du NFT à mint.
    function mintExistingCollection(address _collectionAddress, string calldata _uri) external returns(uint) {
        require(uriExistsdMap[ _uri] != true, unicode'Cet URI existe déjà.'); // voir si on conserve cette ligne
        NFTCollection721 collection = NFTCollection721(_collectionAddress);
        uint256 _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri );
        uriExistsdMap[ _uri] = true;

        return(collection.tokenIds());
    }
   
}   