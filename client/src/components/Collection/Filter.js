import { useEffect } from "react";

const profil = {
  address: "0x545rt54et5y545454",
};

function Filter({ popular, setActiveSell, setFiltered, activeSell, addr }) {
  useEffect(() => {
    if (activeSell === "All") {
      setFiltered(popular);
      console.log(popular);
      return;
    }
    if (activeSell === "Sell") {
      const filteredTrue = popular.filter((pop) => pop.selling == true);
      setFiltered(filteredTrue);
      return;
    }
    if (activeSell === "No sell") {
      const filteredFalse = popular.filter((pop) => pop.selling == false);
      console.log(filteredFalse);
      setFiltered(filteredFalse);
      console.log(Number(popular[0].price));
      return;
    }
    if (activeSell === "Croissant") {
      const filteredCroissant = popular.sort((a, b) =>
        Number(a.price) > Number(b.price) ? 1 : -1
      );
      setFiltered(filteredCroissant);
      return;
    }
    if (activeSell === "Decroissant") {
      const filteredDecroissant = popular.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
      setFiltered(filteredDecroissant);
      console.log(filteredDecroissant);
      return;
    }
    if (activeSell === "Mine") {
      const filteredMine = popular.filter((pop) => pop.seller == addr[0]);
      setFiltered(filteredMine);
      console.log(filteredMine);
      return;
    }
  }, [activeSell]);
  return (
    <div className="filter-container">
      <button
        className={activeSell == "All" ? "active" : ""}
        onClick={() => setActiveSell("All")}
      >
        Tous
      </button>
      <button
        className={activeSell == "Sell" ? "active" : ""}
        onClick={() => setActiveSell("Sell")}
      >
        A vendre
      </button>
      <button
        className={activeSell == "No sell" ? "active" : ""}
        onClick={() => setActiveSell("No sell")}
      >
        Vendu
      </button>
      {/* <button
        className={activeSell == "Croissant" ? "active" : ""}
        onClick={() => setActiveSell("Croissant")}
      >
        Prix croissant
      </button>
      <button
        className={activeSell == "Decroissant" ? "active" : ""}
        onClick={() => setActiveSell("Decroissant")}
      >
        Prix décroissant
      </button> */}
      <button
        className={activeSell == "Mine" ? "active" : ""}
        onClick={() => setActiveSell("Mine")}
      >
        Mes NFTs
      </button>
    </div>
  );
}

export default Filter;
