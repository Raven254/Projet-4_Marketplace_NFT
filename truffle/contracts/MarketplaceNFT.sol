// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

import "./NFTFactory.sol"; // Non-nécessaire

contract MarketplaceNFT is ReentrancyGuard {

    // Adresses recevant les frais 
    address payable public Clement;
    address payable public Olivier;
    address payable public Marwane;
    
    uint public feePercent; // Le pourcentage de frais
    uint public feeVault; // Enregistre la somme des fees

    using Counters for Counters.Counter; // Ajout de la struct Counters, afin de compter les items à afficher

    // Permet de donner un id à chaque NFT sur la marketplace. Fonctions utilisables :  _tokenId.increment(), _tokenId.decrement(), et _tokenId.current()
    Counters.Counter private _nftCount; 

    struct NFT721 { // voir quoi ajouter
        uint marketplaceId;
        uint nftId;
        IERC721 nftInstance; // instance du contrat NFT
        uint price; // pour le price, il faut faire attention à convertir en wei avec web3js, et reconvertir en ether dans l'affichage
        address payable seller;
        bool selling;
        bool sold; // Enlever sold pour garder que selling
    }

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

    mapping(uint => NFT721) public NFTs;

    constructor(uint _feePercent, address _clement, address _olivier, address _marwane){ // : A INITIER DANS LE DEPLOYER
        feePercent = _feePercent;
        Clement = payable(_clement);
        Olivier = payable(_olivier);
        Marwane = payable(_marwane);
    }

    modifier onlyCMO() {
        require(msg.sender == Clement || msg.sender == Olivier || msg.sender == Marwane, unicode"Vous n'êtes pas habilité à lancer cette fonction.");
        _;
    }

    ///@dev FONCTION permettant au vendeur de poser son NFT sur la plateforme
    ///@param _nft défini l'instance du NFT associé (pour pouvoir utiliser ses fonctions)
    ///@param _nftId id du NFT que l'on met en vente
    ///@param _price prix du NFT
    function makeOffer(IERC721 _nft, uint _nftId, uint _price) external nonReentrant { // toWei pour adapter le prix d'ether à wei sur web3js
        require(_price >= 0, unicode"Vous devez paramétrer un prix positif ou nul.");
        require(_nftId > 0, unicode"L'Id de votre NFT doit être supérieur à 0");
        _nft.setApprovalForAll(address(this), true);
        _nft.safeTransferFrom(msg.sender, address(this), _nftId);
        _nftCount.increment();
        uint _marketplaceId = _nftCount.current();
        NFTs[_marketplaceId] = NFT721 (
            _marketplaceId,
            _nftId,
            _nft,
            _price,
            payable(msg.sender),
            true,
            false
        );

        emit Offered(
        _nftId,
        address(_nft), 
        _price,
        msg.sender
        );

        // Ajouter la possibilité de paramétrer un temps avant le renvoi du NFT au vendeur, paramétrable par le vendeur, attention sécurité
    }

    ///@dev FONCTION permettant au vendeur d'arrêter sa vente
    ///@param _marketplaceId id du NFT sur la marketplace
    function stopSelling(uint _marketplaceId) external {
        NFT721 memory nft = NFTs[_marketplaceId]; // instanciation du NFT dont on souhaite arrêter la vente
        require(msg.sender == nft.seller, unicode"Vous n'êtes pas le vendeur du NFT");
        require(nft.selling == true, "Le NFT nest pas en vente actuellement");
        nft.nftInstance.safeTransferFrom(address(this), msg.sender, nft.nftId);
        NFTs[_marketplaceId].selling = false;

        emit StopSelling(
        nft.nftId,
        address(nft.nftInstance), 
        msg.sender
        );
    }

    ///@dev FONCTION permettant à l'acheteur d'acheter un NFT sur la plateforme
    ///@param _marketplaceId id du NFT sur la marketplace
    function purchaseNFT(uint _marketplaceId) external payable nonReentrant {
        
        require(_marketplaceId > 0 && _marketplaceId <= _nftCount.current(), "Ce NFT n'existe pas.");
        NFT721 memory nft = NFTs[_marketplaceId]; // instanciation du NFT voulu à l'achat
        uint totalPrice = getTotalPrice(_marketplaceId);

        require(msg.value == totalPrice, "Veuillez envoyer le montant exact.");
        require(nft.sold == false, unicode"Ce NFT n'est pas en vente ou a déjà été vendu");
        uint fee = totalPrice - nft.price;
        feeVault += fee;
        nft.seller.transfer(nft.price);
        nft.nftInstance.safeTransferFrom(address(this), msg.sender, nft.nftId);
        
        NFTs[_marketplaceId].sold = true;
        NFTs[_marketplaceId].selling = false;

        emit Bought(
            nft.nftId,
            address(nft.nftInstance), 
            nft.price,
            nft.seller,
            msg.sender
        );
    }   

    ///@dev Calcule le total du prix à payer avec les fees.
    ///@param _marketplaceId id du NFT sur la marketplace
    function getTotalPrice(uint _marketplaceId) view public returns(uint) {
        uint totalPrice = NFTs[_marketplaceId].price*(1000+feePercent/1000);
        return(totalPrice);
    }

    function feeDistribution(uint _feeAmount) external onlyCMO {
        require(_feeAmount <= address(this).balance, "Il n'y a pas assez de fonds sur le contrat.");
        uint partEgale = 33*_feeAmount/100; // Améliorer : pour un _feeAmount de 30, la partEgale est de 9.9, et donc de 9 (arrondis à l'inf). To Wei à faire ici
        Clement.transfer(partEgale);
        Olivier.transfer(partEgale);
        Marwane.transfer(partEgale);
        uint partTotale = partEgale*3;
        emit FeeDistribution(_feeAmount, partTotale, partEgale, address(this).balance);
    }

    ///@dev FONCTION permettant au vendeur de créer une enchère
    ///@param _id id du NFT dont on dépose le prix
    ///@param _startPrice prix de départ du NFT
    ///@param _time temps total d'attente de l'enchère.

}
