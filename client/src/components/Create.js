import React, { useState } from "react";
import Dropdown from "./Dropdown";

const Create = () => {
  const state = {
    file: null,
    nameCollection: "",
    nameNFT: "",
  };
  const options = [
    { label: "Fruit", value: "fruit" },
    { label: "Vegetable", value: "vegetable" },
    { label: "Meat", value: "meat" },
  ];
  const [value, setValue] = React.useState("");

  const handleSelect = (event) => {
    setValue(event.target.value);
  };
  const fileSelectedHandler = (event) => {
    let file = event.target.files[0];
    console.log(event.target.files[0]);
  };
  const fileUploadHandler = (event) => {
    console.log(state.file);
  };
  const addCollection = (event) => {};
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <div className="FormCollectionSection">
        <h1 style={{ fontSize: "3em", textAlign: "center" }}>
          Créez une collection
        </h1>
        <label htmlFor="NameCollection">Nom de la collection</label>
        <input
          type="text"
          className="form-control"
          id="NameCollection"
          name="NameCollection"
        />
        <button className="buttonForm" onClick={addCollection}>
          Ajoutez
        </button>
      </div>
      <div className="FormNFTSection">
        <h1 style={{ fontSize: "3em", textAlign: "center" }}>
          Ajoutez un NFT à une collection
        </h1>
        <Dropdown
          label="Choisi la collection :"
          options={options}
          value={value}
          onChange={handleSelect}
        />
        <label htmlFor="NameCollection">Nom du NFT</label>
        <input
          type="text"
          className="form-control"
          id="NameCollection"
          name="NameCollection"
        />
        <label htmlFor="NameCollection">Inserez une image</label>
        <input
          type="file"
          className="form-control"
          id="file"
          name="file"
          onChange={fileSelectedHandler}
        />
        <button className="buttonForm" onClick={fileUploadHandler}>
          Ajoutez
        </button>
      </div>
    </div>
  );
};

export default Create;
