import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ERC721 from "../../contracts/ERC721.json";
import Loader from "../Loader/Loader";

function NFT({ contract, addr, web3 }) {
  const state = {
    Price: "",
  };
  let navigate = useNavigate();
  const params = useParams();
  const [NFT, setNFT] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    (async () => {
      const itemByCollection = await contract.methods
        .getItemByCollections(params.nameCollection, params.nftId)
        .call();
      setNFT(itemByCollection);
      console.log(itemByCollection);
    })();
  }, []);
  const SelectedPrice = (event) => {
    state.Price = event.target.value;
  };

  const addPrice = (event) => {
    const instanceERC721 = new web3.eth.Contract(ERC721.abi, NFT.nftInstance);
    sellNFT(params.nameCollection, NFT.nftId, state.Price);
  };
  const buy = (event) => {
    const priceWei = web3.utils.toWei(NFT.totalPrice, "ether");
    buyNFT(params.nameCollection, NFT.nftId, priceWei);
  };
  const stopSell = (event) => {
    stopSelling(params.nameCollection, NFT.nftId);
  };

  const stopSelling = async (nameCollection, nftId, price) => {
    setLoader(true);
    const stop = await contract.methods
      .stopSelling(nameCollection, nftId)
      .send({ from: addr[0] })
      .then((result) => navigate("/"))
      .catch((error) => console.log(error));
  };
  const buyNFT = async (nameCollection, nftId, price) => {
    // const instanceERC721 = new web3.eth.Contract(ERC721.abi, NFT.nftInstance);
    // const approve = await instanceERC721.methods
    //   .setApprovalForAll(contract._address, true)
    //   .send({ from: addr[0] });
    // console.log(JSON.stringify(approve));
    // console.log(price);
    setLoader(true);
    const send = await contract.methods
      .purchaseNFT(nameCollection, nftId)
      .send({ from: addr[0], value: price })
      .then((result) => navigate("/"))
      .catch((error) => console.log(error));
  };

  const sellNFT = async (nameCollection, nftId, price) => {
    setLoader(true);
    const instanceERC721 = new web3.eth.Contract(ERC721.abi, NFT.nftInstance);
    const approve = await instanceERC721.methods
      .setApprovalForAll(contract._address, true)
      .send({ from: addr[0] });
    console.log(JSON.stringify(approve));
    const send = await contract.methods
      .sellNFT(nameCollection, nftId, price)
      .send({ from: addr[0] })
      .then((result) => navigate("/"))
      .catch((error) => console.log(error));
  };
  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <div
          style={{
            paddingRight: 200,
            paddingLeft: 200,
            paddingBottom: 120,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 10,
              paddingBottom: 20,
              height: 150,
            }}
          >
            <h2
              style={{
                fontSize: "3em",
                textAlign: "center",
              }}
            >
              {params.nameCollection}
            </h2>
          </div>
          <div className="NFT_section">
            <img src={NFT.tokenURI} className="img_NFT" alt="" />
            <div className="NFT_information">
              <h3
                style={{
                  fontSize: "2em",
                  textAlign: "center",
                }}
              >
                Informations :
              </h3>
              {NFT.seller == addr ? (
                <div>
                  <p> Ceci est un NFT qui vous appartient </p>
                </div>
              ) : (
                <div>
                  <p> Le NFT appartient à {NFT.seller} </p>
                </div>
              )}
              {NFT.price == "0" && NFT.seller == addr ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: 10,
                    alignItems: "center",
                  }}
                >
                  <label htmlFor="NameCollection">Ajout d'un prix</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Price"
                    name="Price"
                    onChange={SelectedPrice}
                  />
                  <button className="buttonForm" onClick={addPrice}>
                    Ajoutez
                  </button>
                </div>
              ) : (
                <div>
                  <p> Ce NFT est à {NFT.price} ETH</p>
                </div>
              )}
              {NFT.selling == true && NFT.seller != addr ? (
                <div>
                  <button className="buttonForm" onClick={buy}>
                    Achetez
                  </button>
                </div>
              ) : NFT.selling == true && NFT.seller == addr ? (
                <div>
                  <button className="buttonForm" onClick={stopSell}>
                    Stop la vente
                  </button>
                </div>
              ) : (
                <div>
                  <p>Ce NFT n'est pas à vendre</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NFT;
