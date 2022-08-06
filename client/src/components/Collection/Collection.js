import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import getAllCollections from "../../fake_data/Collections";
import CatalogNFT from "./CatalogNFT";
import Filter from "./Filter";
import { motion, AnimatePresence } from "framer-motion";

const Collection = ({ contract, addr }) => {
  const params = useParams();
  // const result = getAllCollections().find(({ id }) => id == params.id);
  const [popular, setPopular] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeSell, setActiveSell] = useState("All");
  useEffect(() => {
    (async () => {
      const allItemsByCollection = await contract.methods
        .getAllItemsByCollections(params.nameCollection)
        .call();
      console.log(allItemsByCollection);
      setPopular(allItemsByCollection);
      setFiltered(allItemsByCollection);
    })();
  }, []);
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
        <h2 style={{ fontSize: "2em", textAlign: "center" }}>{params.name}</h2>
      </div>
      <Filter
        popular={popular}
        setFiltered={setFiltered}
        activeSell={activeSell}
        setActiveSell={setActiveSell}
        addr={addr}
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
              img={item.tokenURI}
              price={item.price}
              nftId={item.nftId}
              nameCollection={params.nameCollection}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Collection;
