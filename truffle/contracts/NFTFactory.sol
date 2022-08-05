// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// Importer contrats : IERC1155, IERC721, VRB de Chainlink
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./NFTCollection721.sol";
import "./NFTCollection1155.sol";

contract NFTFactory is ReentrancyGuard {

    using Counters for Counters.Counter; // Ajout de la struct Counters, afin de compter les items à afficher

    // Adresses recevant les frais 
    address payable public Clement;
    address payable public Olivier;
    address payable public Marwane;
    
    uint public feePercent; // Le pourcentage de frais
    uint public feeVault; // Enregistre la somme des fees

    // Permet de donner un id à chaque NFT sur la marketplace. Fonctions utilisables :  _nftCount.increment(), _nftCount.decrement(), et _nftCount.current()
    Counters.Counter private _collectionCounter;
    Counters.Counter private _marketplaceIdCounter;
    Counters.Counter private _nftCount; // MARKETPLACE

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

    //mapping(uint => NFT721) public NFTs; // MARKETPLACE

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

    //event Offered pour signaler une mise en vente
    event Offered (
        uint _nftId,
        address indexed _contract, 
        uint _price,
        address indexed _seller
    ); // indexed permet d'utiliser un filtre en cherchant dans les events

    //event StopSelling pour signaler l'arrêt d'une vente
    event StopSelling (
        uint _nftId,
        address indexed _contract, 
        address indexed _seller
    ); // indexed permet d'utiliser un filtre en cherchant dans les events

    // event Bought pour signaler un achat
    event Bought (
        uint _nftId,
        address indexed _contract, 
        uint _price,
        address indexed _seller,
        address indexed _buyer
    );

    // event pour signaler la distribution des fees
    event FeeDistribution (
        uint _totalDemande,
        uint _partTotale,
        uint _partEgale,
        uint _resteContrat
    );

    // ::::::::::::: CONSTRUCTOR ET MODIFIERS ::::::::::::: //

    constructor(uint _feePercent, address _clement, address _olivier, address _marwane){
        feePercent = _feePercent;
        Clement = payable(_clement);
        Olivier = payable(_olivier);
        Marwane = payable(_marwane);
    }

    modifier onlyCMO() {
        require(msg.sender == Clement || msg.sender == Olivier || msg.sender == Marwane, unicode"Vous n'êtes pas habilité à lancer cette fonction.");
        _;
    }



    // ::::::::::::: DATA GETTERS ::::::::::::: //

    ///@notice Récupère toutes les collections créées.
    function getAllCollections() public view returns(collection721[] memory) {
        return(allNFTCollections);
    }

    ///@notice Récupère toutes les collections de l'utilisateur.
    ///@param _addr Adresse de l'utilisateur à analyser.
    function getCollectionsByAddress(address _addr) public view returns(collection721[] memory) {
        return collectionMap[_addr];
    }
    
    ///@notice Récupère tous les NFTs d'une collection (identifiable par son nom).
    ///@param _name Nom de la collection NFT.
     function getAllItemsByCollections(string memory _name) public view returns(NFT721[] memory) {
        return itemsByCollectionMap[_name];
    }

    ///@notice Récupère le NFT (identifiable par son ID) d'une collection particulière (identifiable par son nom).
    ///@param _name Nom de la collection NFT.
    ///@param _id ID du NFT que l'on cherche dans la collection.
    function getItemByCollections(string memory _name, uint _id) public view returns(NFT721 memory) {
        uint arrayId = _id - 1; // Permet à partir de l'id du NFT de le retrouver dans l'array associée.
        return itemsByCollectionMap[_name][arrayId];
    }

    ///@notice Retourne le nombre de collections créées par l'utilisateur.
    ///@param _addr Adresse de l'utilisateur à analyser.
    function getNbCollectionByAddress(address _addr) public view returns(uint) {
        return collectionMap[_addr].length;
    }



    // ::::::::::::: NFT FACTORY ::::::::::::: //

    ///@notice Permet à l'utilisateur de créer une nouvelle collection et de mint un premier NFT.
    ///@param _name Nom de la collection NFT à créer.
    ///@param _symbol Symbole de la collection NFT à créer.
    ///@param _uri Uri du NFT à mint avec la nouvelle collection.
    function createCollection721(string calldata _name, string calldata _symbol, string calldata _uri /** Ajouter des strings pour les attributs ? et des uint pour les echelles d'aleatoires des attributs ? */) external {       
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")), unicode"Vous devez donner un nom à votre collection");
        require(bytes(_uri).length > 0, "Vous devez fournir une image");
        require(nameExistsMap[ _name] != true, unicode'Ce nom existe déjà.');
        require(symbolExistsdMap[ _symbol] != true, unicode'Ce symbole existe déjà.');        
        require(uriExistsdMap[ _uri] != true, unicode'Cet URI existe déjà.');
        
        NFTCollection721 collection = new NFTCollection721(_name, _symbol); // Ou utiliser create2
    
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
    
    ///@notice Mint un NFT d'une collection déjà existante à partir d'une clé et d'un uri.
    ///@param _key Clé de la collection dans le mapping collectionMap.
    ///@param _uri URI du NFT à mint.
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
   


    // ::::::::::::: MARKETPLACE NFT ::::::::::::: //

    ///@notice Fonction permettant au vendeur de déposer son NFT à la vente sur la plateforme.
    ///@param _name Nom de la collection NFT.
    ///@param _nftId ID du NFT que l'on met en vente.
    ///@param _price Prix du NFT.
    function createOffer(string memory _name, uint _nftId, uint _price) external nonReentrant { // toWei pour adapter le prix d'ether à wei sur web3js
        require(_price >= 0, unicode"Vous devez paramétrer un prix positif ou nul.");
        require(_nftId > 0, unicode"L'Id de votre NFT doit être supérieur à 0.");
        NFT721 memory itemInstance = getItemByCollections(_name, _nftId);
        require(itemInstance.selling == false, unicode"Le NFT est déjà en vente.");
        
        uint itemIdInArray = _nftId-1;
        IERC721 nft = itemInstance.nftInstance;
        
        nft.setApprovalForAll(address(this), true);
        nft.safeTransferFrom(msg.sender, address(this), _nftId);
        
        itemsByCollectionMap[_name][itemIdInArray].price = _price;
        itemsByCollectionMap[_name][itemIdInArray].selling = true;

        emit Offered(
        _nftId,
        address(nft), 
        _price,
        msg.sender
        );
    }

    ///@notice Fonction permettant au vendeur d'arrêter sa vente.
    ///@param _name Nom de la collection NFT.
    ///@param _nftId ID du NFT.
    function stopSelling(string memory _name, uint _nftId) external {
        NFT721 memory itemInstance = getItemByCollections(_name, _nftId); // instanciation du NFT dont on souhaite arrêter la vente
        require(msg.sender == itemInstance.seller, unicode"Vous n'êtes pas le vendeur du NFT");
        require(itemInstance.selling == true, "Le NFT nest pas en vente actuellement");

        uint itemIdInArray = _nftId-1;
        IERC721 nft = itemInstance.nftInstance;

        nft.safeTransferFrom(address(this), msg.sender, _nftId);
        itemsByCollectionMap[_name][itemIdInArray].selling = false;

        emit StopSelling(
        _nftId,
        address(nft), 
        msg.sender
        );
    }

    ///@dev Fonction permettant à l'utilisateur d'acheter un NFT sur la plateforme.
    ///@param _name Nom de la collection NFT.
    ///@param _nftId ID du NFT.
    function purchaseNFT(string memory _name, uint _nftId) external payable nonReentrant {
        
        require(_nftId > 0 && _nftId <= itemsByCollectionMap[_name].length, "Ce NFT n'existe pas.");
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")), unicode"Veuillez entrer un nom de collection.");
        NFT721 memory itemInstance = getItemByCollections(_name, _nftId); // instanciation du NFT dont on souhaite arrêter la vente
        
        uint itemIdInArray = _nftId-1;
        uint totalPrice = getTotalPrice(_name, _nftId);
        uint nftPrice = itemInstance.price;
        address seller = itemInstance.seller;

        require(msg.value == totalPrice, "Veuillez envoyer le montant exact.");
        require(itemInstance.selling == true, unicode"Ce NFT n'est pas en vente ou a déjà été vendu");
        
        uint fee = totalPrice - itemInstance.price;
        feeVault += fee;

        itemInstance.seller.transfer(itemInstance.price);
        itemInstance.nftInstance.safeTransferFrom(address(this), msg.sender, itemInstance.nftId);

        itemsByCollectionMap[_name][itemIdInArray].price = 0;
        itemsByCollectionMap[_name][itemIdInArray].seller = payable(msg.sender);
        itemsByCollectionMap[_name][itemIdInArray].selling = false;
        
        emit Bought(
            _nftId,
            address(itemInstance.nftInstance), 
            nftPrice,
            seller,
            msg.sender
        );
    }   

    ///@notice Calcule le total du prix à payer avec les fees.
    ///@param _name Nom de la collection NFT.
    ///@param _nftId ID du NFT.
    function getTotalPrice(string memory _name, uint _nftId) view public returns(uint) {
        uint itemIdInArray = _nftId-1;
        uint totalPrice = itemsByCollectionMap[_name][itemIdInArray].price*(1000+feePercent/1000);
        return(totalPrice);
    }

    ///@notice Distribue un montant choisi parmi les fees récoltés en part égale entre les owners.
    ///@param _feeAmount Nom de la collection NFT
    function feeDistribution(uint _feeAmount) external onlyCMO {
        require(_feeAmount <= address(this).balance, "Il n'y a pas assez de fonds sur le contrat.");
        uint partEgale = 33*_feeAmount/100; // Améliorer : pour un _feeAmount de 30, la partEgale est de 9.9, et donc de 9 (arrondis à l'inf). To Wei à faire ici
        Clement.transfer(partEgale);
        Olivier.transfer(partEgale);
        Marwane.transfer(partEgale);
        uint partTotale = partEgale*3;
        emit FeeDistribution(_feeAmount, partTotale, partEgale, address(this).balance);
    }

    ///@dev Fonction permettant au vendeur de créer une enchère
    ///@param _id id du NFT dont on dépose le prix
    ///@param _startPrice prix de départ du NFT
    ///@param _time temps total d'attente de l'enchère.

}   