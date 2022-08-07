import React from "react";
import loaderGIF from "../../Images/loader.gif";

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 800,
        backgroundColor: "black",
      }}
    >
      <img src={loaderGIF} />
    </div>
  );
}
