# Projet 4 - Marketplace NFT

**Participants**
+ Olivier H.Q.M.
+ Clément L.
+ Marwane E.J.




// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

//Importer contrats : ERC1155, ERC721, VRB de Chainlink
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFT3.sol";
//import "./NFTCollection1155.sol";




string[] collectionNameArray;






contract NFTFactory {
    event NFTCollection721Created(address _creator, string _name, string _symbol, address _collectionAddress);

    
    function createCollection721 (string calldata _name, string calldata _symbol, string calldata _uri /** Ajouter des strings pour les attributs ? et des uint pour les echelles d'aleatoires des attributs ? */) external {       
        NFTCollection721 collection = new NFTCollection721(_name, _symbol);
            for (uint i; i < collectionNameArray.length; i++) {
                if ( _name == collectionNameArray[i]) {
                    return("This name's collection already exist. Please choose an other one.");
                } {
                    collectionNameArray.push(_name);
                }
            }
             // Ou utiliser create2 en assembly - yul + AJOUTER LES AUTRES PARAMETRES
        require ;
        uint256 _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri ); // EN TRAVAIL
        // Ajouter ici les attributs
        emit NFTCollection721Created(msg.sender, _name, _symbol, address(collection) );
    }
    
    
    
   // function createCollection1155 (string calldata _creator, string calldata _uri, uint _totalSupply, uint _id, uint256 _amount, bytes memory _data /** Ajouter des strings pour les attributs ? et des uint pour les echelles d'aleatoires des attributs ? */) external {
    //    NFTCollection1155 collection = new NFTCollection1155(_uri); // Ou utiliser create2 en assembly - yul + AJOUTER LES AUTRES PARAMETRES
     //   NFTCollection1155(collection).mint(msg.sender, _id, _amount, _data ); // EN TRAVAIL
        // Ajouter ici les attributs
        // emit NFTCollectionCreated(_creator, address(collection), block.timestamp, _totalSupply);
    //}
}
