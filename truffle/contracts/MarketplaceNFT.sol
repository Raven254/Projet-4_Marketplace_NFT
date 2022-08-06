// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

// Importer contrats : IERC1155, IERC721, VRB de Chainlink
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./NFTFactory.sol";

contract MarketplaceNFT is ReentrancyGuard {
    
    // ::::::::::::: INITIALISATION DU CONTRAT ::::::::::::: //
    
    // Déclaration de NFTFactory
    NFTFactory factory = new NFTFactory();

    // Adresses recevant les frais 
    address payable public Clement;
    address payable public Olivier;
    address payable public Marwane;
    
    address marketplaceContract = address(this);

    int public feePercent; // Le pourcentage de frais

    struct collection721 {
        string name;
        string symbol;
        string tokenUri;
        address collectionAddress;
        uint totalSupply;
        bool exist;
    }

    struct NFT721 {
        uint nftId;
        IERC721 nftInstance; // instance du contrat NFT
        string tokenURI;
        int price; // pour le price, il faut faire attention à convertir en wei avec web3js, et reconvertir en ether dans l'affichage
        int totalPrice;
        address payable seller;
        bool selling;
    }

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

    //event Offered pour signaler une mise en vente
    event Offered (
        uint _nftId,
        address indexed _contract, 
        int _price,
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
        int _price,
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

    constructor( int _feePercent, address _clement, address _olivier, address _marwane){
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
    function getAllCollections() external view returns(collection721[] memory) {
        return(allNFTCollections);
    }

    ///@notice Récupère toutes les collections de l'utilisateur.
    ///@param _addr Adresse de l'utilisateur à analyser.
    function getCollectionsByAddress(address _addr) public view returns(collection721[] memory) {
        return collectionMap[_addr];
    }
    
    ///@notice Récupère tous les NFTs d'une collection (identifiable par son nom).
    ///@param _name Nom de la collection NFT.
     function getAllItemsByCollections(string memory _name) external view returns(NFT721[] memory) {
        return itemsByCollectionMap[_name];
    }
    
    ///@notice Récupère le NFT (identifiable par son ID) d'une collection particulière (identifiable par son nom).
    ///@param _name Nom de la collection NFT.
    ///@param _id ID du NFT que l'on cherche dans la collection.
    function getItemByCollections(string memory _name, uint _id) public view returns(NFT721 memory) {
        uint arrayId = _id - 1; // Permet à partir de l'id du NFT de le retrouver dans l'array associée.
        return itemsByCollectionMap[_name][arrayId];
    }



    // ::::::::::::: NFT FACTORY ::::::::::::: //

    ///@notice Permet à l'utilisateur de créer une nouvelle collection et de mint un premier NFT.
    ///@param _name Nom de la collection NFT à créer.
    ///@param _symbol Symbole de la collection NFT à créer.
    ///@param _uri Uri du NFT à mint avec la nouvelle collection.
    function createCollection721(string calldata _name, string calldata _symbol, string calldata _uri) external {       
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")), unicode"Vous devez donner un nom à votre collection.");
        require(keccak256(abi.encodePacked(_symbol)) != keccak256(abi.encodePacked("")), unicode"Vous devez donner un symbole à votre collection.");
        require(bytes(_uri).length > 0, "Vous devez fournir une image.");
        
        NFTCollection721 collection = factory.createCollection(_name, _symbol, _uri);
        
        uint _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri );
        
        allNFTCollections.push(collection721(_name, _symbol, _uri, address(collection), collection.tokenIds(), true));
        collectionMap[msg.sender].push(collection721(_name, _symbol, _uri, address(collection), collection.tokenIds(), true));
        itemsByCollectionMap[_name].push(NFT721(collection.tokenIds(), IERC721(collection), _uri, 0, 0, payable(msg.sender), false));

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

        NFTCollection721 collection = NFTCollection721(collectionStruct.collectionAddress);
        uint256 _id = collection.tokenIds();
        collection.safeMint(msg.sender, _id, _uri );
        
        string memory name = collectionMap[msg.sender][_key].name;

        collectionMap[msg.sender][_key].totalSupply = collection.tokenIds();
        itemsByCollectionMap[name].push(NFT721(collection.tokenIds(), IERC721(collection), _uri, 0, 0, payable(msg.sender), false));

        emit NFT721Created(msg.sender, collectionStruct.name, collectionStruct.symbol, address(collection), _uri, collection.tokenIds(), _key);
    }
   
    
    
    // ::::::::::::: MARKETPLACE NFT ::::::::::::: //

    ///@notice Fonction permettant au vendeur de déposer son NFT à la vente sur la plateforme.
    ///@param _name Nom de la collection NFT.
    ///@param _nftId ID du NFT que l'on met en vente.
    ///@param _price Prix du NFT.
    function sellNFT(string calldata _name, uint _nftId, int _price) external nonReentrant { // toWei pour adapter le prix d'ether à wei sur web3js
        //int priceInWei = _price * 10e18;
        require(_price >= 0, unicode"Vous devez paramétrer un prix positif ou nul.");
        require(_nftId > 0, unicode"L'Id de votre NFT doit être supérieur à 0.");
        NFT721 memory itemInstance = getItemByCollections(_name, _nftId);
        require(itemInstance.selling == false, unicode"Le NFT est déjà en vente.");

        IERC721 nft = itemInstance.nftInstance;
        
        int totalPrice = _price*(1000+feePercent)/1000;

        nft.safeTransferFrom(msg.sender, address(this), _nftId);

        itemsByCollectionMap[_name][_nftId-1].price = _price;
        itemsByCollectionMap[_name][_nftId-1].totalPrice = totalPrice;
        itemsByCollectionMap[_name][_nftId-1].selling = true;

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
    function stopSelling(string calldata _name, uint _nftId) external {
        NFT721 memory itemInstance = getItemByCollections(_name, _nftId); // instanciation du NFT dont on souhaite arrêter la vente
        require(msg.sender == itemInstance.seller, unicode"Vous n'êtes pas le vendeur du NFT");
        require(itemInstance.selling == true, "Le NFT nest pas en vente actuellement");

        IERC721 nft = itemInstance.nftInstance;

        nft.transferFrom(address(this), msg.sender, _nftId);
        itemsByCollectionMap[_name][_nftId-1].price = 0;
        itemsByCollectionMap[_name][_nftId-1].totalPrice = 0;
        itemsByCollectionMap[_name][_nftId-1].selling = false;

        emit StopSelling(
        _nftId,
        address(nft), 
        msg.sender
        );
    }

    ///@dev Fonction permettant à l'utilisateur d'acheter un NFT sur la plateforme.
    ///@param _name Nom de la collection NFT.
    ///@param _nftId ID du NFT.
    function purchaseNFT(string calldata _name, uint _nftId) external payable nonReentrant {

        require(_nftId > 0 && _nftId <= itemsByCollectionMap[_name].length, "Ce NFT n'existe pas.");
        require(keccak256(abi.encodePacked(_name)) != keccak256(abi.encodePacked("")), unicode"Veuillez entrer un nom de collection.");
        NFT721 memory itemInstance = getItemByCollections(_name, _nftId); // instanciation du NFT dont on souhaite arrêter la vente

        int totalPrice = itemInstance.totalPrice;

        require(int(msg.value) >= totalPrice, "Veuillez envoyer le montant exact.");
        require(itemInstance.selling == true, unicode"Ce NFT n'est pas en vente ou a déjà été vendu");
 
        IERC721 nft = itemInstance.nftInstance;
        nft.transferFrom(marketplaceContract, msg.sender, _nftId);

        itemInstance.seller.transfer(uint(itemInstance.price));
        //itemInstance.nftInstance.safeTransferFrom(address(this), msg.sender, itemInstance.nftId);

        itemsByCollectionMap[_name][_nftId-1].price = 0;
        itemsByCollectionMap[_name][_nftId-1].totalPrice = 0;
        itemsByCollectionMap[_name][_nftId-1].seller = payable(msg.sender);
        itemsByCollectionMap[_name][_nftId-1].selling = false;

        emit Bought(
            _nftId,
            address(itemInstance.nftInstance), 
            totalPrice,
            itemInstance.seller,
            msg.sender
        );
    }

    ///@notice Distribue un montant choisi parmi les fees récoltés en part égale entre les owners.
    ///@param _feeAmount Nom de la collection NFT.
    function feeDistribution(uint _feeAmount) external onlyCMO {
        uint feeAmountInWei = _feeAmount*10e18;
        require(feeAmountInWei <= address(this).balance, "Il n'y a pas assez de fonds sur le contrat.");
        uint partEgale = 33*_feeAmount/100; // Améliorer : pour un _feeAmount de 30, la partEgale est de 9.9, et donc de 9 (arrondis à l'inf). To Wei à faire ici
        Clement.transfer(partEgale);
        Olivier.transfer(partEgale);
        Marwane.transfer(partEgale);
        uint partTotale = partEgale*3;
        emit FeeDistribution(_feeAmount, partTotale, partEgale, address(this).balance);
    }

    ///@notice Fonction permettant au vendeur de créer une enchère
    ///@param _id id du NFT dont on dépose le prix
    ///@param _startPrice prix de départ du NFT
    ///@param _time temps total d'attente de l'enchère.
    function auction(uint _id, uint _startPrice, uint _time) public {
        // WIP
    }

    ///@notice ERC721 Receiver.
    ///@param operator Adresse de la marketplace.
    ///@param from Adresse du propriétaire du NFT.
    ///@param tokenId ID du token.
    ///@param data Data ajoutée en plus.
    function onERC721Received( address operator, address from, uint256 tokenId, bytes calldata data ) public pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
    
    
}   