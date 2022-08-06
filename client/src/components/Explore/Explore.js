import React from "react";
import Catalog from "./Catog.js";

const Explore = ({ allCollection }) => {
  console.log(allCollection);
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
          Explorez les collections
        </h2>
      </div>
      <div className="explore__content">
        {allCollection.map((item, index) => (
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
