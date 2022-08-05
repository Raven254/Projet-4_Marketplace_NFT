import React from "react";
import Catalog from "./Catog.js";

const Explore = ({ myCollection }) => {
  console.log(myCollection);
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
          Explore the collections
        </h2>
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

export default Explore;
