import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import { Route, Routes } from "react-router-dom";

import Home from "./components/Home/Home";
import Create from "./components/Create";
import { Explore } from "./components/Explore/Explore";
import Profil from "./components/Profil";
import Collection from "./components/Collection/Collection";
import NFT from "./components/NFT/NFT";
import Upload from "./components/Upload";

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
        //  const deployedNetwork = VotingContract.networks[networkId];
        //  const instance = new web3.eth.Contract(
        //    VotingContract.abi,
        //    deployedNetwork && deployedNetwork.address
        //  );

        //  console.log(instance.methods);

        //  let workflowStatus = await instance.methods.workflowStatus().call();
        //  let owner = await instance.methods.owner().call();
        //  setContractState({ owner: owner, workflowStatus: workflowStatus });

        setState({ web3: web3, accounts: accounts });
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
        <Route path="/explore" element={<Explore />} />
        <Route path="/create" element={<Create />} />
        <Route path="/profil" element={<Profil addr={state.accounts} />} />
        <Route path="/collection/:id" element={<Collection />} />
        <Route path="/collection/:idCollection/NFT/:id" element={<NFT />} />
      </Routes>
      <Upload />
      <Footer />
    </div>
  );
}

export default App;
