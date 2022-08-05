import React from "react";
import { useParams } from "react-router-dom";
import getAllCollections from "../../fake_data/Collections";

const profil = {
  address: "0x545rt54et5y545454",
};

function NFT() {
  const state = {
    Price: "",
  };
  const params = useParams();
  const collection = getAllCollections().find(
    ({ id }) => id == params.idCollection
  );
  const collection_NFT = collection.NFT;
  const NFT = collection_NFT.find(({ id }) => id == params.id);

  const addPrice = (event) => {
    console.log(event.target.value);
  };
  return (
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
          {NFT.title}
        </h2>
      </div>
      <div className="NFT_section">
        <img src={NFT.image} className="img_NFT" alt="" />
        <div className="NFT_information">
          <h3
            style={{
              fontSize: "2em",
              textAlign: "center",
            }}
          >
            Informations :
          </h3>
          {NFT.address == profil.address ? (
            <div>
              <p> Ceci est un NFT qui vous appartient </p>
            </div>
          ) : (
            <div>
              <p> Le NFT appartient à {NFT.address} </p>
            </div>
          )}
          {NFT.price == null && NFT.address == profil.address ? (
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
              />
              <button className="buttonForm" onClick={addPrice}>
                Ajoutez
              </button>
            </div>
          ) : (
            <div>
              <p> Ce NFT est à vendre au prix de {NFT.price} ETH</p>
            </div>
          )}
          {NFT.sell == true && NFT.address != profil.address ? (
            <div>
              <button className="active">Achetez </button>
            </div>
          ) : NFT.address == profil.address ? (
            <div></div>
          ) : (
            <div>
              <p>Ce NFT n'est pas à vendre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NFT;
