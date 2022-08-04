import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { Button } from "../Button/ButtonElements";
import NFT from "../NFT/NFT";

const CatalogNFT = (props) => {
  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(!hover);
  };

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.8 }}
      layout
      className="catalog"
    >
      <Link to={`/Collection/${props.idCollection}/NFT/${props.id}`}>
        <img src={props.img} className="img" alt="" />
      </Link>
      <div className="catalog__btn">
        {props.price != null ? (
          <Button
            to="/Create/"
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            primary="true"
            dark="true"
          >
            {props.price} ETH
          </Button>
        ) : (
          <Button
            to="/Create/"
            onMouseEnter={onHover}
            onMouseLeave={onHover}
            primary="true"
            dark="true"
          >
            - ETH
          </Button>
        )}
      </div>
    </motion.div>
  );
};

CatalogNFT.propTypes = {
  id: PropTypes.number.isRequired,
  idCollection: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default CatalogNFT;
