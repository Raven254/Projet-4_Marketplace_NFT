import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import {Route, Routes} from 'react-router-dom';

import Home from "./components/Home/Home";
import {Create} from "./components/Create";
import { Explore } from "./components/Explore/Explore";
import Profil from "./components/Profil";
import Collection from "./components/Collection/Collection";
import NFT from "./components/NFT/NFT";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null, addresses: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      let options = {
        fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
        toBlock: 'latest'
      };

      let options1 = {
        fromBlock: 0,                  //Number || "earliest" || "pending" || "latest"
      };

      let listAddress = await instance.getPastEvents('dataStored', options);

      instance.events.dataStored(options1)
                          .on('data', event => listAddress.push(event));
      const response = await instance.methods.get().call();


      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ storageValue: response, web3, accounts, contract: instance, addresses:listAddress });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runSet = async () => {
    const { accounts, contract} = this.state;
    let valeur=document.getElementById("valeur").value;
    const transac = await contract.methods.set(valeur).send({ from: accounts[0] });
    const response = await contract.methods.get().call();



    console.log("l'adresse est celle ci: " + transac.events.dataStored.returnValues.addr);
    console.log("la data est celle ci: " + transac.events.dataStored.returnValues.data);
    console.log(transac);

    this.setState({ storageValue: response });
    };

  render() {
    return (
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/collection/:idCollection/NFT/:id" element={<NFT />} />
        </Routes>
      </div>
    );
}
}

export default App;