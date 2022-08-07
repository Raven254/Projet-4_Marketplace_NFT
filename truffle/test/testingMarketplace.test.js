const MarketplaceNFT = artifacts.require("MarketplaceNFT");
const { BN, expectRevert, expectEvent } = require("../node_modules/@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("MarketplaceNFT", accounts => {
    const owner = accounts[0];
    const creator1 = accounts[1];
    const buyer1 = accounts[2];

    let MarketplaceNFTInstance;

    describe("Test de NFTFactory par le owner.", function() {
        
        context("Test de createCollection721", function() {
            beforeEach(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new(25, "0x4421170B2A7Eb9826AAfc9788Af8865D5b48CE16", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", {from: owner});
            });

            // TEST DES REQUIRE
            it("Ajout d'un '_name' vide, test du require.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("", "NFT", "https:\/\/NFT-1.com\/", {from: creator1}), "Vous devez donner un nom à votre collection.");
            });

            it("Ajout d'un '_symbol' vide, test du require.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("NFT", "", "https:\/\/NFT-1.com\/", {from: creator1}), "Vous devez donner un symbole à votre collection.");
            });

            it("Ajout d'un '_uri' vide, test du require.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("NFT", "NFT", "", {from: creator1}), "Vous devez fournir une image.");
            });
 
            // TEST DES STOCKAGES DE DONNEES
            it("Ajout d'une collection, test du exist sur allNFTCollections[].", async() => {
                await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
                const verifArray = await MarketplaceNFTInstance.allNFTCollections(0);
                expect(verifArray.exist, "La collection n'existe pas.").to.be.true;
            });

            it("Ajout d'une collection, test du exist sur le mapping collectionMap.", async() => {
                await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
                const verifMapping = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const verifCollection = verifMapping[0];
                expect(verifCollection.exist, "La collection n'existe pas.").to.be.true;
            });

            it("Ajout d'un NFT, test du nftId sur le mapping itemsByCollectionMap.", async() => {
                await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
                const verifMapping = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionName = verifMapping[0].name;
                const nftStruct = await MarketplaceNFTInstance.getItemByCollections(collectionName, 1, {from: creator1})
                
                expect(new BN(nftStruct.nftId), "L'Id du NFT n'existe pas ou n'est pas la bonne.").to.be.bignumber.equal(new BN(1));
                expect(nftStruct.tokenURI, "Le tokenURI n'est pas le bon.").to.equal("https:\/\/NFT-1.com\/");
            });

            // TEST DES EVENTS
            it("Test de l'event NFTCollection721Created.", async() => {
                const collectionCreated = await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
                expectEvent(collectionCreated, "NFTCollection721Created", {creator: creator1}, {name: "Robots" }, {symbol: "RBT" }, {collectionAddress: "https:\/\/NFT-1.com\/"});
            });

            it("Test de l'event NFT721Created.", async() => {
                const collectionCreated = await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
                expectEvent(collectionCreated, "NFT721Created", {creator: creator1}, {name: "Robots" }, {symbol: "RBT" }, {collectionAddress: "https:\/\/NFT-1.com\/"}, 1, 0);
            });
          });
          
        context("Test de mintExistingCollection721.", function() {
            beforeEach(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new(25, "0x4421170B2A7Eb9826AAfc9788Af8865D5b48CE16", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", {from: owner});
                await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
            });

            // TEST DU REQUIRE
            it("Ajout d'une key supérieure au nombre de collections appartenant à l'utilisateur, doit revert", async() => {
                await expectRevert(MarketplaceNFTInstance.mintExistingCollection721(1, "https:\/\/pageWebRevert.com\/", {from: creator1}), "La _key doit être inférieure strictement au nombre de collections possédées.");
            });

            // TEST DES STOCKAGES DE DONNEES
            it("Test de l'incrémentation de totalSupply dans le mapping collectionMap pour la collection 'Robots'.", async() => {
                await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/NFT-2.com\/", {from: creator1});
                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collection = collectionMap[0];
                expect(new BN(collection.totalSupply), "La collection n'existe pas.").to.be.bignumber.equal(new BN(2));
            });

            it("Ajout d'un NFT, test du nftId sur le mapping itemsByCollectionMap.", async() => {
                await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/pageweb2.com\/", {from: creator1});
                
                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionName = collectionMap[0].name;
                const nftStruct = await MarketplaceNFTInstance.getItemByCollections(collectionName, 2, {from: creator1})
                
                expect(new BN(nftStruct.nftId), "L'Id du NFT n'existe pas ou n'est pas la bonne.").to.be.bignumber.equal(new BN(2));
                expect(nftStruct.tokenURI, "Le tokenURI n'est pas le bon.").to.equal("https:\/\/NFT2.com\/");
            });

            // TEST DES EVENTS
            it("L'event du passage à ProposalsRegistrationStarted fonctionne", async() => {
              //Insérer ici
            });
        });
    });

    /**
// ------------------------------------- SUITE A TRAVAILLER ----------------------------------------------
    describe("Test de MarketplaceNFT.", function() {
        
        context("Test de sellNFT", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
                instanceCollectionNFT = await adressedelacollection;
                adressedelacollection.setApprovalForAll(marketplaceNFTInstance, true, {from:owner}); // voir avec Clément
            });

            it("", async() => {
                //Insérer ici
            });
        });

        context("Test de stopSelling.", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                //Insérer ici
            });
      });

        context("Test de purchaseNFT.", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                //Insérer ici
            });
        });

        context("Test de getTotalPrice.", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                //Insérer ici
            });
        });

        context("Test de feeDistribution.", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                //Insérer ici
            });
        });

        context("Test de sellNFT", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                //Insérer ici
            });
        });

    }); */
});