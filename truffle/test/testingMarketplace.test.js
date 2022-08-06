const MarketplaceNFT = artifacts.require("MarketplaceNFT");
const { BN, expectRevert, expectEvent } = require("../node_modules/@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("MarketplaceNFT", accounts => {
    const owner = accounts[0];
    const buyer1 = accounts[1];
    const buyer2 = accounts[2];

    let MarketplaceNFTInstance;

    describe("Test de NFTFactory.", function() {
        
        context("Test de createCollection721", function() {
            beforeEach(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            // TEST DES REQUIRE
            it("Ajout d'un '_name' vide, test du require.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("", "NFT", "https:\/\/pageweb.com\/", {from: owner}), "Vous devez donner un nom à votre collection.");
            });

            it("Ajout d'un '_symbol' vide, test du require.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("NFT", "", "https:\/\/pageweb.com\/", {from: owner}), "Vous devez donner un symbole à votre collection.");
            });

            it("Ajout d'un '_uri' vide, test du require.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("NFT", "NFT", "", {from: owner}), "Vous devez fournir une image.");
            });
 
            // TEST DES STOCKAGE DE DONNEES
            it("Test allNFTCollections.", async() => {
              //Insérer ici
            });

            it("Test collectionMap.", async() => {
              //Insérer ici
            });

            it("Test itemsByCollectionMap.", async() => {
              //Insérer ici
            });

            // TEST DES EVENTS
            it("Test NFTCollection721Created.", async() => {
              //Insérer ici
            });

            it("Test NFT721Created.", async() => {
              //Insérer ici
            });
          });
 
        context("Test de mintExistingCollection721.", function() {
            before(async() => {
              MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            // TEST DES REQUIRE
            it("L'event du passage à ProposalsRegistrationStarted fonctionne", async() => {
              //Insérer ici
            });

            it("L'event du passage à ProposalsRegistrationEnded fonctionne", async() => {
              //Insérer ici
            });

            // TEST DES STOCKAGE DE DONNEES
            it("L'event du passage à ProposalsRegistrationStarted fonctionne", async() => {
              //Insérer ici
            });

            it("L'event du passage à ProposalsRegistrationEnded fonctionne", async() => {
              //Insérer ici
            });

            // TEST DES EVENTS
            it("L'event du passage à ProposalsRegistrationStarted fonctionne", async() => {
              const stateData1 = await MarketplaceNFTInstance.workflowStatus.call();
              //Insérer ici
            });
        });
    });

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

    });
});