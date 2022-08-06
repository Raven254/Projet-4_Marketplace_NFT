import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import MarketplaceNFT from "./contracts/MarketplaceNFT.json";
import { Route, Routes } from "react-router-dom";

import Home from "./components/Home/Home";
import Create from "./components/Create";
import Profil from "./components/Profil";
import Explore from "./components/Explore/Explore";
import Collection from "./components/Collection/Collection";
import NFT from "./components/NFT/NFT";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

function App() {
  const [state, setState] = useState({
    isOwner: false,
    isVoter: false,
    web3: null,
    accounts: null,
    contract: null,
    contractMarketplaceNFT: null,
    myCollection: null
  });
  const [contractState, setContractState] = useState({
    owner: "",
    workflowStatus: 0,
  });

  useEffect(() => {
    (async function () {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        console.log(web3);

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
        console.log(accounts[0]);
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        console.log(networkId);
        const deployedNetwork = MarketplaceNFT.networks[networkId];
        console.log(deployedNetwork);
        const instanceMarketplaceNFT = new web3.eth.Contract(
          MarketplaceNFT.abi,
          deployedNetwork && deployedNetwork.address
        );
        console.log(instanceMarketplaceNFT);
        //  const deployedNetwork = VotingContract.networks[networkId];
        //  const instance = new web3.eth.Contract(
        //    VotingContract.abi,
        //    deployedNetwork && deployedNetwork.address
        //  );

        //  console.log(instance.methods);

        //  let workflowStatus = await instance.methods.workflowStatus().call();
        //  let owner = await instance.methods.owner().call();
        //  setContractState({ owner: owner, workflowStatus: workflowStatus });
        const myCollectionNFT = await instanceMarketplaceNFT.methods
          .getCollectionsByAddress (accounts[0])
          .call();

        console.log(myCollectionNFT);

        setState({
          web3: web3,
          accounts: accounts,
          contractMarketplaceNFT: instanceMarketplaceNFT,
          myCollection: myCollectionNFT
        });
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, []);
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/explore"
          element={<Explore myCollection={state.myCollection} />}
        />
        <Route
          path="/create"
          element={
            <Create
              contract={state.contractMarketplaceNFT}
              addr={state.accounts}
              myCollection={state.myCollection}
            />
          }
        />
        <Route
          path="/profil"
          element={
            <Profil addr={state.accounts} myCollection={state.myCollection} />
          }
        />
        <Route
          path="/collection/:id"
          element={
            <Collection
              contract={state.contractMarketplaceNFT}
              addr={state.accounts}
            />
          }
        />
        <Route path="/collection/:idCollection/NFT/:id" element={<NFT />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
