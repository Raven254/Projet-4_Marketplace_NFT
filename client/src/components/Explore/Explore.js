import React, { useEffect } from "react";
import Catalog from "./Catog.js";

const Explore = ({ collection }) => {
  const [Collection, setCollection] = React.useState(collection);
  // useEffect(() => {
  //   (async function () {
  //     console.log(contract);
  //     const getCollection = await contract.methods
  //       .getCollections(addr[0])
  //       .call();
  //     setCollection(getCollection);
  //   })();
  // }, []);
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
         {Collection.map((item, index) => (
          <Catalog key={index} img={item["2"]} name={item["0"]} id={index} />
        ))} 
      </div>
    </div>
  );
};

export default Explore;
