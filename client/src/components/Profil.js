import React from "react";
import Catalog from "./Explore/Catog";

const Profil = ({ addr, myCollection }) => {
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
        <h2 style={{ fontSize: "2em", textAlign: "center" }}>
          Bienvenue {addr}
        </h2>
      </div>
      <div className="explore__content">
        {myCollection.length == 0 ? (
          <div
            style={{
              padding: 25,
              height: 400,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontSize: "1.5em", textAlign: "center" }}>
              Vous n'avez pas de collection
            </h3>
          </div>
        ) : (
          myCollection.map((item, index) => (
            <Catalog
              key={index}
              img={item.tokenUri}
              name={item.name}
              id={index}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profil;
