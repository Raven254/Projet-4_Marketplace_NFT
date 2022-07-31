import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import getAllCollections from "../../fake_data/Collections";
import CatalogNFT from "./CatalogNFT";
import Filter from "./Filter";
import { motion, AnimatePresence } from "framer-motion";

const Collection = () => {
  const params = useParams();
  const result = getAllCollections().find(({ id }) => id == params.id);
  const [popular, setPopular] = useState(result.NFT);
  const [filtered, setFiltered] = useState(result.NFT);
  const [activeSell, setActiveSell] = useState("All");
  // useEffect(() =>{
  //     fetchPopular();
  //  });
  // const fetchPopular = () =>{
  // const result =  getAllCollections().find( ({ id }) => id == params.id );

  console.log(filtered);
  console.log(activeSell);
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
        <h2 style={{ fontSize: "2em", textAlign: "center" }}>{result.title}</h2>
      </div>
      <Filter
        popular={popular}
        setFiltered={setFiltered}
        activeSell={activeSell}
        setActiveSell={setActiveSell}
      />
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        layout
        className="explore__content"
      >
        <AnimatePresence>
          {filtered.map((item, index) => (
            <CatalogNFT
              key={index}
              img={item.image}
              price={item.price}
              id={item.id}
              idCollection={params.id}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Collection;
