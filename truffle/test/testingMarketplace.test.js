const MarketplaceNFT = artifacts.require("MarketplaceNFT");
const ERC721 = artifacts.require("ERC721");

const { BN, expectRevert, expectEvent } = require("../node_modules/@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("MarketplaceNFT", accounts => {
    const owner = accounts[0];
    const creator1 = accounts[1];
    const creator2 = accounts[2];
    const buyer1 = accounts[3];

    let MarketplaceNFTInstance;


    // ::::::::::::: TEST DE NFT FACTORY ::::::::::::: //

    describe("Test de NFTFactory par l'utilisateur creator1.", function() {
        
        context("Test de createCollection721().", function() {
            beforeEach(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new(25, "0x4421170B2A7Eb9826AAfc9788Af8865D5b48CE16", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", {from: owner});
            });

            // TEST DES REQUIRE
            it("Doit revert après l'ajout d'un '_name' vide.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("", "NFT", "https:\/\/NFT-1.com\/", {from: creator1}), "Vous devez donner un nom à votre collection.");
            });

            it("Doit revert après l'ajout d'un '_symbol' vide.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("NFT", "", "https:\/\/NFT-1.com\/", {from: creator1}), "Vous devez donner un symbole à votre collection.");
            });

            it("Doit revert après l'ajout d'un '_uri' vide.", async() => {
                await expectRevert(MarketplaceNFTInstance.createCollection721("NFT", "NFT", "", {from: creator1}), "Vous devez fournir une image.");
            });
 
            // TEST DES STOCKAGES DE DONNEES
            it("Doit retourner 'true' quand on check le param 'exist' de la collection sur allNFTCollections[]..", async() => {
                await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
                const verifArray = await MarketplaceNFTInstance.allNFTCollections(0);
                expect(verifArray.exist, "La collection n'existe pas.").to.be.true;
            });

            it("Doit retourner 'true' quand on check le param 'exist' de la collection sur le mapping collectionMap.", async() => {
                await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
                const verifMapping = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const verifCollection = verifMapping[0];
                expect(verifCollection.exist, "La collection n'existe pas.").to.be.true;
            });

            it("Doit retourner le bon nftId à partir du mapping itemsByCollectionMap.", async() => {
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
                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collectionMap[0].collectionAddress;
                expectEvent(collectionCreated, "NFTCollection721Created", {creator: creator1, name: "Robots", symbol: "RBT", collectionAddress: collectionAddr});
            });

            it("Test de l'event NFT721Created.", async() => {
                const collectionCreated = await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collectionMap[0].collectionAddress;
                expectEvent(collectionCreated, "NFT721Created", {creator: creator1, name: "Robots", symbol: "RBT", collectionAddress: collectionAddr, uri: "https:\/\/NFT-1.com\/", tokenId: new BN(1), collectionMapArrayKey: new BN(0)});
            });
          });
          
        context("Test de mintExistingCollection721().", function() {
            beforeEach(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new(25, "0x4421170B2A7Eb9826AAfc9788Af8865D5b48CE16", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", {from: owner});
                await MarketplaceNFTInstance.createCollection721("Robots", "RBT", "https:\/\/NFT-1.com\/", {from: creator1});
            });

            // TEST DU REQUIRE
            it("Doit revert avec l'ajout d'une key supérieure au nombre de collections appartenant à l'utilisateur.", async() => {
                await expectRevert(MarketplaceNFTInstance.mintExistingCollection721(1, "https:\/\/pageWebRevert.com\/", {from: creator1}), "La _key doit être inférieure strictement au nombre de collections possédées.");
            });

            // TEST DES STOCKAGES DE DONNEES
            it("Doit vérifier l'incrémentation de totalSupply dans le mapping collectionMap pour la collection 'Robots'.", async() => {
                await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/NFT-2.com\/", {from: creator1});
                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collection = collectionMap[0];
                expect(new BN(collection.totalSupply), "La collection n'existe pas.").to.be.bignumber.equal(new BN(2));
            });

            it("Doit vérifier l'ajout du nftId sur le mapping itemsByCollectionMap.", async() => {
                await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/NFT2.com\/", {from: creator1});
                
                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionName = collectionMap[0].name;
                const nftStruct = await MarketplaceNFTInstance.getItemByCollections(collectionName, 2, {from: creator1})
                
                expect(new BN(nftStruct.nftId), "L'Id du NFT n'existe pas ou n'est pas la bonne.").to.be.bignumber.equal(new BN(2));
                expect(nftStruct.tokenURI, "Le tokenURI n'est pas le bon.").to.equal("https:\/\/NFT2.com\/");
            });

            // TEST DES EVENTS
            it("Test de l'event NFT721Created.", async() => {
                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collectionMap[0].collectionAddress;
                const nftMinted = await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/NFT2.com\/", {from: creator1});
                expectEvent(nftMinted, "NFT721Created", {creator: creator1, name: "Robots", symbol: "RBT" , collectionAddress: collectionAddr, uri: "https:\/\/NFT2.com\/", tokenId: new BN(2), collectionMapArrayKey: new BN(0)});
            });
        });
    });


    // ::::::::::::: TEST DE DATA GETTERS ::::::::::::: //
    describe("Test des DATA GETTERS par les utilisateurs creator1 et creator2.", function() {
        beforeEach(async() => {
            MarketplaceNFTInstance = await MarketplaceNFT.new(25, "0x4421170B2A7Eb9826AAfc9788Af8865D5b48CE16", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", {from: owner});
            
            await MarketplaceNFTInstance.createCollection721("Collection 1", "C1", "https:\/\/Collection-1.NFT-1.com\/", {from: creator1});
            await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/Collection-1.NFT-2.com\/", {from: creator1});
            
            await MarketplaceNFTInstance.createCollection721("Collection 2", "C2", "https:\/\/Collection-2.NFT-2.com\/", {from: creator1});
            await MarketplaceNFTInstance.mintExistingCollection721(1, "https:\/\/Collection-2.NFT-2.com\/", {from: creator1});
        
            await MarketplaceNFTInstance.createCollection721("Collection 3", "C3", "https:\/\/Collection-3.NFT-1.com\/", {from: creator2});
            await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/Collection-3.NFT-2.com\/", {from: creator2});
        });

        it("getAllCollections() doit retourner toutes les collections.", async() => {
            const allCollections = await MarketplaceNFTInstance.getAllCollections();

            expect(new BN(allCollections.length), "allCollections.length =/= 3.").to.be.bignumber.equal(new BN(3));
            expect(allCollections[0].name, "allCollections[0].name =/= Collection 1.").to.equal("Collection 1");
            expect(allCollections[1].symbol, "allCollections[1].symbol =/= C2.").to.equal("C2");
            expect(allCollections[2].tokenUri, "allCollections[2].tokenUri n'a pas le bon URI.").to.equal("https:\/\/Collection-3.NFT-1.com\/");
        });

        it("getCollectionsByAddress() doit retourner toutes les collections de l'utilisateur creator1.", async() => {
            const allCollectionsCreator1 = await MarketplaceNFTInstance.getCollectionsByAddress(creator1, {from: creator1});
            const allCollectionsCreator2 = await MarketplaceNFTInstance.getCollectionsByAddress(creator2, {from: creator2});
            
            expect(new BN(allCollectionsCreator1.length), "allCollectionsCreator1.length =/= 2.").to.be.bignumber.equal(new BN(2));
            expect(new BN(allCollectionsCreator2.length), "allCollectionsCreator1.length =/= 1.").to.be.bignumber.equal(new BN(1));


            expect(allCollectionsCreator1[0].name, "allCollectionsCreator1[0].name =/= Collection 1.").to.equal("Collection 1");
            expect(allCollectionsCreator1[1].symbol, "allCollectionsCreator1[1].symbol =/= C2.").to.equal("C2");
            expect(allCollectionsCreator2[0].tokenUri, "allCollectionsCreator2[0].tokenUri n'a pas le bon URI.").to.equal("https:\/\/Collection-3.NFT-1.com\/");
        });

        it("getAllItemsByCollections() doit retourner tous les NFT de la collection choisie.", async() => {
            const allItemsCollection1 = await MarketplaceNFTInstance.getAllItemsByCollections("Collection 1", {from: creator1});
            const allItemsCollection3 = await MarketplaceNFTInstance.getAllItemsByCollections("Collection 3", {from: creator1});

            expect(new BN(allItemsCollection1.length), "allItemsCollection1.length =/= 2.").to.be.bignumber.equal(new BN(2));
            expect(new BN(allItemsCollection3.length), "allItemsCollection3.length =/= 2.").to.be.bignumber.equal(new BN(2));

            expect(allItemsCollection1[1].seller, "allItemsCollection1[1].seller =/= creator1.").to.equal(creator1);
            expect(allItemsCollection1[1].tokenURI, "allItemsCollection1[1].tokenURI n'a pas le bon URI.").to.equal("https:\/\/Collection-1.NFT-2.com\/");
            expect(new BN(allItemsCollection1[1].nftId), "allItemsCollection1[1].nftId=/= 2.").to.be.bignumber.equal(new BN(2));

            expect(allItemsCollection3[0].seller, "allItemsCollection3[1].seller =/= creator2.").to.equal(creator2);
            expect(allItemsCollection3[0].tokenURI, "allItemsCollection3[1].tokenURI n'a pas le bon URI.").to.equal("https:\/\/Collection-3.NFT-1.com\/");
            expect(new BN(allItemsCollection3[0].nftId), "allItemsCollection3[1].nftId=/= 1.").to.be.bignumber.equal(new BN(1));
        
        });

        it("getItemByCollections() doit retourer le NFT de la collection choisie, par son nftId.", async() => {
            const NFT2OfCollection3 = await MarketplaceNFTInstance.getItemByCollections("Collection 3", 2, {from: creator1});

            expect(NFT2OfCollection3.seller, "NFT2OfCollection3.seller =/= creator2.").to.equal(creator2);
            expect(NFT2OfCollection3.tokenURI, "NFT2OfCollection3.tokenURI n'a pas le bon URI.").to.equal("https:\/\/Collection-3.NFT-2.com\/");
            expect(new BN(NFT2OfCollection3.nftId), "NFT2OfCollection3.nftId=/= 2.").to.be.bignumber.equal(new BN(2));
        });
    });


    // ::::::::::::: TEST DE MARKETPLACE NFT ::::::::::::: //

    describe("Test de MarketplaceNFT par les utilisateurs creator1 et creator2.", function() {
        
        context("Test de sellNFT() pour un NFT qui n'est pas déjà en vente.", function() {
            beforeEach(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new(25, "0x4421170B2A7Eb9826AAfc9788Af8865D5b48CE16", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", {from: owner});
                await MarketplaceNFTInstance.createCollection721("Collection 1", "C1", "https:\/\/Collection-1.NFT-1.com\/", {from: creator1});
                await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/Collection-1.NFT-2.com\/", {from: creator1});    
            });

            // TEST DU SETAPPROVALFORALL
            it("Doit renvoyer un évenement pour setApprovalForAll() du vendeur à la marketplace.", async() => {               
                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;
                const instanceERC721 = await ERC721.at(collectionAddr);
                const approval = await instanceERC721.setApprovalForAll(MarketplaceNFTInstance.address, creator1, {from: creator1});
                expectEvent(approval, "ApprovalForAll", {owner: creator1, operator: MarketplaceNFTInstance.address, approved: true});
            });

            // TEST DES REQUIRE
            it("Doit revert après l'ajout d'un '_price' nul.", async() => {
                await expectRevert(MarketplaceNFTInstance.sellNFT("Collection 1", 1, 0, {from: creator1}), "Vous devez donner un prix strictement positif à votre NFT.");
            });

            it("Doit revert si '_nftId' nul ou négatif.", async() => {
                await expectRevert(MarketplaceNFTInstance.sellNFT("Collection 1", 0, 1, {from: creator1}), "L'Id de votre NFT ne peut être égal à 0.");
            });

            it("Doit revert si '_nftId' nul ou négatif.", async() => {
                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;
                const instanceERC721 = await ERC721.at(collectionAddr);
                await instanceERC721.setApprovalForAll(MarketplaceNFTInstance.address, creator1, {from: creator1});
                
                await MarketplaceNFTInstance.sellNFT("Collection 1", 1, 1000, {from: creator1});

                await expectRevert(MarketplaceNFTInstance.sellNFT("Collection 1", 1, 1000, {from: creator1}), "Le NFT est déjà en vente.");
            });
            
            // TEST DES STOCKAGES DE DONNEES
            it("getItemByCollections() doit renvoyer un prix (sans frais ajoutés) pour le NFT 1.", async() => {               
                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;
                const instanceERC721 = await ERC721.at(collectionAddr);
                await instanceERC721.setApprovalForAll(MarketplaceNFTInstance.address, creator1, {from: creator1});
                
                await MarketplaceNFTInstance.sellNFT("Collection 1", 1, 1000, {from: creator1});
                
                const nftItem = await MarketplaceNFTInstance.getItemByCollections("Collection 1", 1);
                const nftPrice = nftItem.price;
                expect(new BN(nftPrice), "Le prix renvoyé n'est pas le bon.").to.be.bignumber.equal(new BN(1000));
            });

            it("getItemByCollections() doit renvoyer un prix total (frais ajoutés) pour le NFT 1.", async() => {               
                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;
                const instanceERC721 = await ERC721.at(collectionAddr);
                const approval = await instanceERC721.setApprovalForAll(MarketplaceNFTInstance.address, creator1, {from: creator1});
                
                await MarketplaceNFTInstance.sellNFT("Collection 1", 1, 1000, {from: creator1});
                
                const nftItem = await MarketplaceNFTInstance.getItemByCollections("Collection 1", 1);
                const nftTotalPrice = nftItem.totalPrice; // = à 1.025 * price.
                expect(new BN(nftTotalPrice), "Le prix renvoyé n'est pas le bon.").to.be.bignumber.equal(new BN(1025));
            });

            it("getItemByCollections() doit renvoyer true pour 'selling'.", async() => {               
                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;
                const instanceERC721 = await ERC721.at(collectionAddr);
                await instanceERC721.setApprovalForAll(MarketplaceNFTInstance.address, creator1, {from: creator1});
                
                await MarketplaceNFTInstance.sellNFT("Collection 1", 1, 1000, {from: creator1});
                
                const nftItem = await MarketplaceNFTInstance.getItemByCollections("Collection 1", 1);
                const nftIsSelling = nftItem.selling;
                expect(nftIsSelling, "Le 'selling' ne retourne pas true.").to.be.true;
            });

            // TEST DES EVENTS
            it("Test de l'event Offered.", async() => {
                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;
                const instanceERC721 = await ERC721.at(collectionAddr);
                await instanceERC721.setApprovalForAll(MarketplaceNFTInstance.address, creator1, {from: creator1});
                
                const sellNft = await MarketplaceNFTInstance.sellNFT("Collection 1", 1, 1000, {from: creator1});
                expectEvent(sellNft, "Offered", {_nftId: new BN(1), uri: "https:\/\/Collection-1.NFT-1.com\/", _contract: collectionAddr , _price: new BN(1000), _seller: creator1});
            });

        });

        context("Test de stopSelling().", function() {
            beforeEach(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new(25, "0x4421170B2A7Eb9826AAfc9788Af8865D5b48CE16", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", {from: owner});
                await MarketplaceNFTInstance.createCollection721("Collection 1", "C1", "https:\/\/Collection-1.NFT-1.com\/", {from: creator1});
                await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/Collection-1.NFT-2.com\/", {from: creator1});

                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;
                const instanceERC721 = await ERC721.at(collectionAddr);
                await instanceERC721.setApprovalForAll(MarketplaceNFTInstance.address, creator1, {from: creator1});
                
                await MarketplaceNFTInstance.sellNFT("Collection 1", 1, 1000, {from: creator1});
            });

            // TEST DES REQUIRE
            it("Doit revert si le caller de la fonction n'est pas le propriétaire du NFT (creator1).", async() => {
                await expectRevert(MarketplaceNFTInstance.stopSelling("Collection 1", new BN(1), {from: creator2}), "Vous n'êtes pas le vendeur du NFT.");
            });

            it("Doit revert si le NFT n'est pas en vente.", async() => {
                await expectRevert(MarketplaceNFTInstance.stopSelling("Collection 1", new BN(2), {from: creator1}), "Ce NFT n'est pas en vente.");
            });

            // TEST DES STOCKAGES DE DONNEES
            it("getItemByCollections() doit renvoyer un prix (sans frais ajoutés) pour le NFT 1.", async() => {               
                await MarketplaceNFTInstance.stopSelling("Collection 1", new BN(1), {from: creator1});
                
                const nftItem = await MarketplaceNFTInstance.getItemByCollections("Collection 1", 1);
                const nftPrice = nftItem.price;
                expect(new BN(nftPrice), "Le prix renvoyé n'est pas le bon.").to.be.bignumber.equal(new BN(0));
            });

            it("getItemByCollections() doit renvoyer un prix total (frais ajoutés) pour le NFT 1.", async() => {               
                await MarketplaceNFTInstance.stopSelling("Collection 1", new BN(1), {from: creator1});

                const nftItem = await MarketplaceNFTInstance.getItemByCollections("Collection 1", 1);
                const nftTotalPrice = nftItem.totalPrice; // = à 1.025 * price.
                expect(new BN(nftTotalPrice), "Le prix renvoyé n'est pas le bon.").to.be.bignumber.equal(new BN(0));
            });

            it("getItemByCollections() doit renvoyer true pour 'selling'.", async() => {               
                await MarketplaceNFTInstance.stopSelling("Collection 1", new BN(1), {from: creator1});

                const nftItem = await MarketplaceNFTInstance.getItemByCollections("Collection 1", 1);
                const nftIsSelling = nftItem.selling;
                expect(nftIsSelling, "Le 'selling' ne retourne pas false.").to.be.false;
            });

            // TEST DES EVENTS
            it("Test de l'event StopSelling.", async() => {
                const stopSellingNft = await MarketplaceNFTInstance.stopSelling("Collection 1", new BN(1), {from: creator1});
                
                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;

                expectEvent(stopSellingNft, "StopSelling", {_nftId: new BN(1), uri: "https:\/\/Collection-1.NFT-1.com\/", _contract: collectionAddr , _seller: creator1});
            });
        });

        context("Test de purchaseNFT() par le buyer1.", function() {
            beforeEach(async() => {
                MarketplaceNFTInstance = await MarketplaceNFT.new(25, "0x4421170B2A7Eb9826AAfc9788Af8865D5b48CE16", "0x7F5aF8d07770d2Df562409cD447D90E670A3eedb", "0xFF0B5Aa862bDb101be86cE3C10440CAe866fFcEe", {from: owner});
                await MarketplaceNFTInstance.createCollection721("Collection 1", "C1", "https:\/\/Collection-1.NFT-1.com\/", {from: creator1});
                await MarketplaceNFTInstance.mintExistingCollection721(0, "https:\/\/Collection-1.NFT-2.com\/", {from: creator1});

                const collection = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collection[0].collectionAddress;
                const instanceERC721 = await ERC721.at(collectionAddr);
                await instanceERC721.setApprovalForAll(MarketplaceNFTInstance.address, creator1, {from: creator1});
                
                await MarketplaceNFTInstance.sellNFT("Collection 1", 1, 1000, {from: creator1});
            });

            // TEST DES REQUIRE
            it("Doit revert si l'id du NFT = 0.", async() => {
                await expectRevert(MarketplaceNFTInstance.purchaseNFT("Collection 1", 0, {from: buyer1, value: 1025}), "Ce NFT n'existe pas.");
            });

            it("Doit revert si l'id du NFT est supérieure à la totalSupply actuelle de la collection.", async() => {
                await expectRevert(MarketplaceNFTInstance.purchaseNFT("Collection 1", 5, {from: buyer1, value: 1025}), "Ce NFT n'existe pas.");
            });

            it("Doit revert si msg.value est inférieure au prix du NFT.", async() => {
                await expectRevert(MarketplaceNFTInstance.purchaseNFT("Collection 1", 1, {from: buyer1, value: 10}), "Veuillez envoyer le montant exact.");
            });

            it("Doit revert si le NFT n'est pas encore en vente.", async() => {
                await expectRevert(MarketplaceNFTInstance.purchaseNFT("Collection 1", 2, {from: buyer1, value: 1025}), "Ce NFT n'est pas en vente ou a déjà été vendu.");
            });

            // TEST DES STOCKAGES DE DONNEES
            it("Doit vérifier que le price est retourné à 0 après l'achat.", async() => {
                await MarketplaceNFTInstance.purchaseNFT("Collection 1", 1, {from: buyer1, value: 1025});

                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionName = collectionMap[0].name;
                const nftStruct = await MarketplaceNFTInstance.getItemByCollections(collectionName, 1, {from: buyer1});

                expect(new BN(nftStruct.price), "Le price n'est pas retourné à 0.").to.be.bignumber.equal(new BN(0));
            });

            it("Doit vérifier que le totalPrice est retourné à 0 après l'achat.", async() => {
                await MarketplaceNFTInstance.purchaseNFT("Collection 1", 1, {from: buyer1, value: 1025});

                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionName = collectionMap[0].name;
                const nftStruct = await MarketplaceNFTInstance.getItemByCollections(collectionName, 1, {from: buyer1});

                expect(new BN(nftStruct.totalPrice), "Le totalPrice n'est pas retourné à 0.").to.be.bignumber.equal(new BN(0));
            });

            it("Doit vérifier que le seller est buyer1 après l'achat.", async() => {
                await MarketplaceNFTInstance.purchaseNFT("Collection 1", 1, {from: buyer1, value: 1025});

                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionName = collectionMap[0].name;
                const nftStruct = await MarketplaceNFTInstance.getItemByCollections(collectionName, 1, {from: buyer1});

                expect(nftStruct.seller, "Le seller n'est pas buyer1.").to.equal(buyer1);
            });

            it("Doit vérifier que 'selling' = false après l'achat'.", async() => {
                await MarketplaceNFTInstance.purchaseNFT("Collection 1", 1, {from: buyer1, value: 1025});

                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionName = collectionMap[0].name;
                const nftStruct = await MarketplaceNFTInstance.getItemByCollections(collectionName, 1, {from: buyer1});

                expect(nftStruct.selling, "Le NFT est toujours en vente.").to.be.false;
            });

            // TEST DES EVENTS
            it("Test de l'event Bought.", async() => {
                const collectionMap = await MarketplaceNFTInstance.getCollectionsByAddress(creator1);
                const collectionAddr = collectionMap[0].collectionAddress;
                const nftBought = await MarketplaceNFTInstance.purchaseNFT("Collection 1", 1, {from: buyer1, value: 1025});                ;
                expectEvent(nftBought, "Bought", {_nftId: new BN(1), uri: "https:\/\/Collection-1.NFT-1.com\/", _contract: collectionAddr, _price: new BN(0), _seller: creator1, _buyer: buyer1});
            });
        });
    });
});