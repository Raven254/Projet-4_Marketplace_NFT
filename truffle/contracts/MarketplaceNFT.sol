// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
// Importer counter
import "./NFTFactory.sol";

contract MarketplaceNFT is ReentrancyGuard {
    // State variables
    // FEES
    // Addresses receiving fees
    address payable public Clement;
    address payable public Olivier;
    address payable public Marwane;
    
    uint public feePercent; // Le pourcentage de frais

    // Importer counter

    uint public nftCount; // Permet de donner un id à chaque NFT sur la marketplace.

    struct NFT { // voir quoi ajouter
        uint nftId;
        IERC721 nft; // instance du contrat NFT
        uint price;
        address payable seller;
        bool sold;
    }

    constructor(uint _feePercent, address _clement, address _olivier, address _marwane){
        feePercent = _feePercent;
        Clement = payable(_clement);
        Olivier = payable(_olivier);
        Marwane = payable(_marwane);
    
    }



///@dev FONCTION permettant au vendeur de poser son NFT sur la plateforme
///@param _id id du NFT dont on dépose le prix
///@param _price prix du NFT

///@dev FONCTION permettant au vendeur de créer une enchère
///@param _id id du NFT dont on dépose le prix
///@param _startPrice prix de départ du NFT
///@param _time temps total d'attente de l'enchère.

///@dev FONCTION permettant à l'acheteur d'acheter un NFT sur la plateforme
///@param _id id du NFT dont on dépose le prix
// Vérifier que le NFT est bien en vente ; vérifier que l'adresse est valide ; attention à la sécurité

}
