// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// Importer contrats : IERC1155, IERC721, VRB de Chainlink
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

import "./NFTCollection721.sol";
import "./NFTCollection1155.sol";

contract NFTFactory {

    using Counters for Counters.Counter; // Ajout de la struct Counters, afin de compter les items à afficher

    // Permet de donner un id à chaque NFT sur la marketplace. Fonctions utilisables :  _nftCount.increment(), _nftCount.decrement(), et _nftCount.current()
    Counters.Counter private _collectionCounter;
    Counters.Counter private _marketplaceIdCounter;

    struct collection721 {
        uint collectionId;
        string name;
        string symbol;
        string tokenUri;
        address collectionAddress;
        uint totalSupply;
        bool exist;
    }

    struct NFT721 {
        uint marketplaceId;
        uint nftId;
        IERC721 nftInstance; // instance du contrat NFT
        uint price; // pour le price, il faut faire attention à convertir en wei avec web3js, et reconvertir en ether dans l'affichage
        address payable seller;
        bool selling;
    }

    mapping (string => bool) uriExistsdMap;
    mapping (string => bool) nameExistsMap;
    mapping (string => bool) symbolExistsdMap;
    mapping (address => collection721[]) collectionMap;
    mapping (string => NFT721[]) itemsByCollectionMap;

    collection721[] allNFTCollections;

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
        require(bytes(_uri).length > 0, "Vous devez fournir une image");
        require(nameExistsMap[ _name] != true, unicode'Ce nom existe déjà.');
        require(symbolExistsdMap[ _symbol] != true, unicode'Ce symbole existe déjà.');        
        require(uriExistsdMap[ _uri] != true, unicode'Cet URI existe déjà.');
        
        NFTCollection721 collection = new NFTCollection721(_name, _symbol); // Ou utiliser create2 en assembly - yul + AJOUTER LES AUTRES PARAMETRES
    
        uint256 _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri );

        _collectionCounter.increment();
        _marketplaceIdCounter.increment();
        uint collectionId = _marketplaceIdCounter.current();
        uint marketplaceId = _marketplaceIdCounter.current();

        nameExistsMap[ _name] = true;
        symbolExistsdMap[ _symbol] = true;
        uriExistsdMap[ _uri] = true;

        allNFTCollections.push(collection721(collectionId, _name, _symbol, _uri, address(collection), collection.tokenIds(), true));
        collectionMap[msg.sender].push(collection721(collectionId, _name, _symbol, _uri, address(collection), collection.tokenIds(), true));
        itemsByCollectionMap[_name].push(NFT721(marketplaceId, collection.tokenIds(), IERC721(collection), 0, payable(msg.sender), false));

        uint collectionMapArrayKey = collectionMap[msg.sender].length-1;

        emit NFTCollection721Created(msg.sender, _name, _symbol, address(collection));
        emit NFT721Created(msg.sender, _name, _symbol, address(collection), _uri, collection.tokenIds(), collectionMapArrayKey);
    }
    
    ///@notice permet de mint un NFT d'une collection déjà existante à partir d'une clé
    function mintExistingCollection721(uint _key, string calldata _uri) external {
        require(_key < collectionMap[msg.sender].length);
        collection721 memory collectionStruct = collectionMap[msg.sender][_key];
        require(collectionStruct.exist == true);
        require(uriExistsdMap[ _uri] != true, unicode'Cet URI existe déjà.'); // voir si on conserve cette ligne

        NFTCollection721 collection = NFTCollection721(collectionStruct.collectionAddress);
        uint256 _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri );
        
        string memory name = collectionMap[msg.sender][_key].name;
        _marketplaceIdCounter.increment();
        uint marketplaceId = _marketplaceIdCounter.current();

        uriExistsdMap[ _uri] = true;
        collectionMap[msg.sender][_key].totalSupply = collection.tokenIds();
        itemsByCollectionMap[name].push(NFT721(marketplaceId, collection.tokenIds(), IERC721(collection), 0, payable(msg.sender), false));

        emit NFT721Created(msg.sender, collectionStruct.name, collectionStruct.symbol, address(collection), _uri, collection.tokenIds(), _key);
    }


    ///@notice récupère toutes les collections créées
    function getAllCollections() public view returns(collection721[] memory) {
        return(allNFTCollections);
        }

    ///@notice récupère toutes les collections de l'utilisateur
    function getCollectionsByAddress(address _addr) public view returns(collection721[] memory) {
        return collectionMap[_addr];
        }
    
    ///@notice récupère tous les NFTs d'une collection (identifiable par son nom)
     function getAllItemsByCollections(string memory _name) public view returns(NFT721[] memory) {
        return itemsByCollectionMap[_name];
        }

    ///@notice récupère le NFT (identifiable par son ID) d'une collection particulière (identifiable par son nom)
    function getItemByCollections(string memory _name, uint _id) public view returns(NFT721 memory) {
        uint arrayId = _id - 1; // Permet à partir de l'id du NFT de le retrouver dans l'array associée.
        return itemsByCollectionMap[_name][arrayId];
        }

    ///@notice retourne le nombre de collections créées par l'utilisateur
    function getNbCollectionByAddress(address _addr) public view returns(uint) {
        return collectionMap[_addr].length;
    }
    
}

    