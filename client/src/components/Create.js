import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import Loader from "./Loader/Loader";
const { NFTStorage } = require("nft.storage/dist/bundle.esm.min.js");

//apiKey : récupérer peut être la key dans .en
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAwN2I4NjhhMjE2OUE2MjA5OThjODZENmRhYWEwRGRhN0FBNDJhNDEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTUzOTM3NTY4MSwibmFtZSI6Ik1hcmtldHBsYWNlTkZUIn0.LqTPGBuDi7TsOcjSTm2ofGCNZju67fsJECn-PE0fEZQ";

const Create = ({ contract, addr, myCollection }) => {
  let navigate = useNavigate();
  const client = new NFTStorage({ token: apiKey });
  console.log(client);
  const state = {
    file: null,
    nameCollection: "",
    nameNFT: "",
    symbol: "",
    file_collection: null,
    key: null,
  };
  const [loader, setLoader] = useState(false);
  const handleSelect = (event) => {
    state.key = event.target.value;
    console.log(state.key);
  };
  const fileSelectedHandlerCollection = (event) => {
    state.file_collection = event.target.files[0];
  };
  const fileSelectedHandlerNFT = (event) => {
    state.file = event.target.files[0];
  };
  const SelectedNameCollection = (event) => {
    state.nameCollection = event.target.value;
  };
  const SelectedSymbole = (event) => {
    state.symbol = event.target.value;
  };
  const fileUploadHandler = (event) => {
    uploadIPFSNFT(state.key, state.file);
  };
  const addCollection = (event) => {
    uploadIPFSCollection(
      state.file_collection,
      state.nameCollection,
      state.symbol
    );
  };
  const uploadIPFSCollection = async (
    imageCollection,
    nameCollection,
    symbol
  ) => {
    setLoader(true);
    const cid = await client.storeDirectory([
      new File([imageCollection], nameCollection),
    ]);
    // retourne le tokenURI complet !
    const uri = "https://" + cid + ".ipfs.nftstorage.link/" + nameCollection;
    console.log(uri);
    console.log(contract);
    const send = await contract.methods
      .createCollection721(nameCollection, symbol, uri)
      .send({ from: addr[0] })
      .then((result) => navigate("/"))
      .catch((error) => console.log(error));
  };
  const uploadIPFSNFT = async (key, imageNFT) => {
    setLoader(true);
    const cid = await client.storeDirectory([
      new File([imageNFT], myCollection[key].name),
    ]);
    // retourne le tokenURI complet !
    const uri =
      "https://" + cid + ".ipfs.nftstorage.link/" + myCollection[key].name;
    console.log(uri);
    console.log(contract);
    const send = await contract.methods
      .mintExistingCollection721(key, uri)
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "130vh",
          }}
        >
          <div className="FormCollectionSection">
            <h1 style={{ fontSize: "3em" }}>Créez une collection</h1>
            <label htmlFor="NameCollection">Nom de la collection</label>
            <input
              type="text"
              className="form-control"
              id="NameCollection"
              name="NameCollection"
              onChange={SelectedNameCollection}
            />
            <label htmlFor="NameCollection">Le symbole</label>
            <input
              type="text"
              className="form-control"
              id="Symbol"
              name="Symbol"
              onChange={SelectedSymbole}
            />
            <label htmlFor="NameCollection">Inserez une image</label>
            <input
              type="file"
              className="form-control"
              id="file_collection"
              name="file_collection"
              onChange={fileSelectedHandlerCollection}
            />
            <button className="buttonForm" onClick={addCollection}>
              Ajoutez
            </button>
          </div>
          <div className="FormNFTSection">
            <h1 style={{ fontSize: "3em", textAlign: "center" }}>
              Ajoutez un NFT à une collection
            </h1>
            <Dropdown
              label="Choisi la collection :"
              options={myCollection}
              value={state.key}
              onChange={handleSelect}
            />
            <label htmlFor="NameCollection">Inserez une image</label>
            <input
              type="file"
              className="form-control"
              id="file"
              name="file"
              onChange={fileSelectedHandlerNFT}
            />
            <button className="buttonForm" onClick={fileUploadHandler}>
              Ajoutez
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;
