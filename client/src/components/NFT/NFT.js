import React from "react";
import { useParams } from "react-router-dom";
import getAllCollections from "../../fake_data/Collections";

function NFT() {
  const params = useParams();
  const collection = getAllCollections().find(
    ({ id }) => id == params.idCollection
  );
  const collection_NFT = collection.NFT;
  const NFT = collection_NFT.find(({ id }) => id == params.id);
  return (
    <div
      style={{
        paddingRight: 200,
        paddingLeft: 200,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 15,
          paddingBottom: 25,
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
          <p> Le prix est de {NFT.price} ETH</p>
          <p> Le NFT appartient à {NFT.address} </p>
          {NFT.sell == true ? (
            <div>
              <p> Ce NFT est à vendre</p>
              <button className="active">Achetez </button>
            </div>
          ) : (
            <p>Ce NFT n'est pas à vendre</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NFT;
