// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// Importer contrats : IERC1155, IERC721, VRB de Chainlink
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

import "./NFTCollection721.sol";
import "./NFTCollection1155.sol";

contract NFTFactory {

    struct NFT721 { // voir quoi ajouter
        string name;
        string symbol;
        string tokenUri;
        address collectionAddress;
        uint totalSupply;
        bool exist;
    }

    mapping (string => bool) uriExistsdMap;
    mapping (string => bool) nameExistsMap;
    mapping (string => bool) symbolExistsdMap;
    mapping (address => NFT721[]) collectionMap;

    event NFTCollection721Created(
        address creator,
        string name,
        string symbol,
        address collectionAddress
    );

    event NFT721Created(
        address creator,
        string name,
        string symbol,
        address collectionAddress,
        string uri,
        uint tokenId,
        uint collectionMapArrayKey
    );

    ///@notice permet à l'utilisateur de créer une nouvelle collection et de mint un premier NFT
    function createCollection721(string calldata _name, string calldata _symbol, string calldata _uri /** Ajouter des strings pour les attributs ? et des uint pour les echelles d'aleatoires des attributs ? */) external {       
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")), unicode"Vous devez donner un nom à votre collection");
        require(nameExistsMap[ _name] != true, unicode'Ce nom existe déjà.');
        require(symbolExistsdMap[ _symbol] != true, unicode'Ce symbole existe déjà.');        
        require(uriExistsdMap[ _uri] != true, unicode'Cet URI existe déjà.');
        
        NFTCollection721 collection = new NFTCollection721(_name, _symbol); // Ou utiliser create2 en assembly - yul + AJOUTER LES AUTRES PARAMETRES
    
        uint256 _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri );

        nameExistsMap[ _name] = true;
        symbolExistsdMap[ _symbol] = true;
        uriExistsdMap[ _uri] = true;
        collectionMap[msg.sender].push(NFT721(_name, _symbol, _uri, address(collection), collection.tokenIds(), true));

        uint collectionMapArrayKey = collectionMap[msg.sender].length-1;

        emit NFTCollection721Created(msg.sender, _name, _symbol, address(collection));
        emit NFT721Created(msg.sender, _name, _symbol, address(collection), _uri, collection.tokenIds(), collectionMapArrayKey);
    }
    
    ///@notice permet de mint un NFT d'une collection déjà existante à partir d'un nom
    //function mintExistingCollection7211(string memory _name, string calldata _uri) external {
    //   NFT721[] memory collections = collectionMap[msg.sender];
    //   require(collections.length > 0);

    //   uint associatedCollectionKey;
    //   address associatedCollectionContract;
    //   bool associatedCollectionExists;

    //   for(uint i = 0; i < collections.length; i++){
    //        if ( keccak256(abi.encodePacked(collections[i].name)) == keccak256(abi.encodePacked(_name))) {
    //            associatedCollectionExists = true;
    //            associatedCollectionKey = i;
    //            associatedCollectionContract = collections[i].collectionAddress;
    //        }
    //    }

    //    require(associatedCollectionExists == true);

    //}

    ///@notice permet de mint un NFT d'une collection déjà existante à partir d'une clé
    function mintExistingCollection721(uint _key, string calldata _uri) external {
        require(_key < collectionMap[msg.sender].length);
        NFT721 memory collectionStruct = collectionMap[msg.sender][_key];
        require(collectionStruct.exist == true);
        require(uriExistsdMap[ _uri] != true, unicode'Cet URI existe déjà.'); // voir si on conserve cette ligne

        NFTCollection721 collection = NFTCollection721(collectionStruct.collectionAddress);
        uint256 _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri );

        uriExistsdMap[ _uri] = true;
        collectionMap[msg.sender][_key].totalSupply = collection.tokenIds();

        emit NFT721Created(msg.sender, collectionStruct.name, collectionStruct.symbol, address(collection), _uri, collection.tokenIds(), _key);
    }

    ///@notice permet de récupérer les collections de l'utilisateur
    function getCollections(address _addr) public view returns(NFT721[] memory) {
        return collectionMap[_addr];
        }
    }


    // Pour le Uri --> ajouter base uri (https://cf-ipfs.com/ipfs/:hash) au constructor, puis tokenUri (1.png) au mint des NFT.
 
   // function createCollection1155 (string calldata _creator, string calldata _uri, uint _totalSupply, uint _id, uint256 _amount, bytes memory _data /** Ajouter des strings pour les attributs ? et des uint pour les echelles d'aleatoires des attributs ? */) external {
    //    NFTCollection1155 collection = new NFTCollection1155(_uri); // Ou utiliser create2 en assembly - yul + AJOUTER LES AUTRES PARAMETRES
     //   NFTCollection1155(collection).mint(msg.sender, _id, _amount, _data ); // EN TRAVAIL
        // Ajouter ici les attributs
        // emit NFTCollectionCreated(_creator, address(collection), block.timestamp, _totalSupply);
    //}
