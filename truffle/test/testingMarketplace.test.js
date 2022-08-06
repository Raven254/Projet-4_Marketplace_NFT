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
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            // TEST DES REQUIRE
            it("Ajout d'un '_name' vide, test du require.", async() => {
                const stateData = await MarketplaceNFTInstance.workflowStatus.call();
                expect(new BN(stateData)).to.be.bignumber.equal(new BN(0));
            });

            it("Ajout d'un '_symbol' vide, test du require.", async() => {
              const stateData = await MarketplaceNFTInstance.workflowStatus.call();
              expect(new BN(stateData)).to.be.bignumber.equal(new BN(0));
            });

            it("Ajout d'un '_uri' vide, test du require.", async() => {
                await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
                const stateData = await MarketplaceNFTInstance.workflowStatus.call();
                expect(new BN(stateData)).to.be.bignumber.equal(new BN(1));
            });

            // TEST DES STOCKAGE DE DONNEES
            it("Test allNFTCollections.", async() => {
              await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
              const stateData = await MarketplaceNFTInstance.workflowStatus.call();
              expect(new BN(stateData)).to.be.bignumber.equal(new BN(1));
            });

            it("Test collectionMap.", async() => {
              await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
              const stateData = await MarketplaceNFTInstance.workflowStatus.call();
              expect(new BN(stateData)).to.be.bignumber.equal(new BN(1));
            });

            it("Test itemsByCollectionMap.", async() => {
              await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
              const stateData = await MarketplaceNFTInstance.workflowStatus.call();
              expect(new BN(stateData)).to.be.bignumber.equal(new BN(1));
            });

            // TEST DES EVENTS
            it("Test NFTCollection721Created.", async() => {
              await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
              const stateData = await MarketplaceNFTInstance.workflowStatus.call();
              expect(new BN(stateData)).to.be.bignumber.equal(new BN(1));
            });

            it("Test NFT721Created.", async() => {
              await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
              const stateData = await MarketplaceNFTInstance.workflowStatus.call();
              expect(new BN(stateData)).to.be.bignumber.equal(new BN(1));
            });
          });

// ------------------------------------- SUITE A TRAVAILLER ----------------------------------------------
        context("Test de mintExistingCollection721.", function() {
            before(async() => {
              MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            // TEST DES REQUIRE
            it("L'event du passage à ProposalsRegistrationStarted fonctionne", async() => {
                const stateData1 = await MarketplaceNFTInstance.workflowStatus.call();
                expect(new BN(stateData1)).to.be.bignumber.equal(new BN(0));

                const stateData2 = await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
                expectEvent(stateData2, 'WorkflowStatusChange', {previousStatus: new BN(0) , newStatus: new BN(1)} );
            });

            it("L'event du passage à ProposalsRegistrationEnded fonctionne", async() => {
                const stateData2 = await MarketplaceNFTInstance.endProposalsRegistering({from: owner});
                expectEvent(stateData2, 'WorkflowStatusChange', {previousStatus: new BN(1) , newStatus: new BN(2)} );
            });

            // TEST DES STOCKAGE DE DONNEES
            it("L'event du passage à ProposalsRegistrationStarted fonctionne", async() => {
              const stateData1 = await MarketplaceNFTInstance.workflowStatus.call();
              expect(new BN(stateData1)).to.be.bignumber.equal(new BN(0));

              const stateData2 = await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
              expectEvent(stateData2, 'WorkflowStatusChange', {previousStatus: new BN(0) , newStatus: new BN(1)} );
            });

            it("L'event du passage à ProposalsRegistrationEnded fonctionne", async() => {
              const stateData2 = await MarketplaceNFTInstance.endProposalsRegistering({from: owner});
              expectEvent(stateData2, 'WorkflowStatusChange', {previousStatus: new BN(1) , newStatus: new BN(2)} );
            });

            // TEST DES EVENTS
            it("L'event du passage à ProposalsRegistrationStarted fonctionne", async() => {
              const stateData1 = await MarketplaceNFTInstance.workflowStatus.call();
              expect(new BN(stateData1)).to.be.bignumber.equal(new BN(0));

              const stateData2 = await MarketplaceNFTInstance.startProposalsRegistering({from: owner});
              expectEvent(stateData2, 'WorkflowStatusChange', {previousStatus: new BN(0) , newStatus: new BN(1)} );
            });
        });
    });


    describe("Test de MarketplaceNFT.", function() {
        
        context("Test de sellNFT", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                /**Insérer ici */
            });
        });

        context("Test de stopSelling.", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                /**Insérer ici */
            });
      });

        context("Test de purchaseNFT.", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                /**Insérer ici */
            });
        });

        context("Test de getTotalPrice.", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                /**Insérer ici */
            });
        });

        context("Test de feeDistribution.", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                /**Insérer ici */
            });
        });

        context("Test de sellNFT", function() {
            before(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new({from: owner});
            });

            it("", async() => {
                /**Insérer ici */
            });
        });

    });
});