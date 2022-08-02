// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// Importer contrats : ERC1155, ERC721, VRB de Chainlink
import "./NFTCollection721.sol";
import "./NFTCollection1155.sol";

contract NFTFactory {

    Collection [] public collectionNamesArray;

    mapping (string => bool) uriExistsdMap;
    mapping (string => bool) nameExistsMap;
    mapping (string => bool) symbolExistsdMap;






    event NFTCollection721Created(address _creator, string _name, string _symbol, address _collectionAddress);

    
    function createCollection721 (string calldata _name, string calldata _symbol, string calldata _uri /** Ajouter des strings pour les attributs ? et des uint pour les echelles d'aleatoires des attributs ? */) external {       
        
        require(nameExistsMap[ _name] != true, 'This name already exists');
        require(symbolExistsdMap[ _symbol] != true, 'This symbol already exists');        
        require(uriExistsdMap[ _uri] != true, 'This uri already exists');
        
        NFTCollection721 collection = new NFTCollection721(_name, _symbol); // Ou utiliser create2 en assembly - yul + AJOUTER LES AUTRES PARAMETRES
    
        uint256 _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri ); // EN TRAVAIL

        nameExistsMap[ _name] = true;
        collectionNamesArray.push( _name);     
        symbolExistsdMap[ _symbol] = true;
        uriExistsdMap[ _uri] = true;



        // Ajouter ici les attributs
        emit NFTCollection721Created(msg.sender, _name, _symbol, address(collection) );
    }
    // Pour le Uri --> Prendre en compte le baseUri à mettre directemnt à la création de la collection (au constructor meme), puis tokenUri à chaque mint.

    // Fonction pour ajouter un safeMint à partir d'une collection déjà créée
    // --> Pour ça faire un mapping adresse --> Tableau de struct, à partir d'une struct NFT.
    // On va require que le mint à faire est issu d'une des collections et on va lancer le safeMint
    
   // function createCollection1155 (string calldata _creator, string calldata _uri, uint _totalSupply, uint _id, uint256 _amount, bytes memory _data /** Ajouter des strings pour les attributs ? et des uint pour les echelles d'aleatoires des attributs ? */) external {
    //    NFTCollection1155 collection = new NFTCollection1155(_uri); // Ou utiliser create2 en assembly - yul + AJOUTER LES AUTRES PARAMETRES
     //   NFTCollection1155(collection).mint(msg.sender, _id, _amount, _data ); // EN TRAVAIL
        // Ajouter ici les attributs
        // emit NFTCollectionCreated(_creator, address(collection), block.timestamp, _totalSupply);
    //}
}