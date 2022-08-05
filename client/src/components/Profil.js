import React from "react";
import getAllCollections from "../fake_data/Collections";
import Catalog from "./Explore/Catog";

const profil = {
  address: "0x545rt54et5y545454",
};

const Profil = ({addr,myCollection}) => {
  const result = getAllCollections().find(({ id }) => id == 1);
  const result_NFT = result.NFT;
  const data = result_NFT.filter((pop) => pop.address == profil.address);
  
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
          height: 150,
        }}
      >
        <h2 style={{ fontSize: "2em", textAlign: "center" }}>Welcome {addr}</h2>
      </div>
      <div className="explore__content">
        {myCollection.map((item, index) => (
          <Catalog
            key={index}
            img={item.tokenUri}
            name={item.name}
            id={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Profil;
