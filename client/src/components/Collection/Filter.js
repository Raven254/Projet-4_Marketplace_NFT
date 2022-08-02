import { useEffect } from "react";

function Filter({ popular, setActiveSell, setFiltered, activeSell }) {
  useEffect(() => {
    if (activeSell === "All") {
      setFiltered(popular);
      return;
    }
    if (activeSell === "Sell") {
      const filteredTrue = popular.filter((pop) => pop.sell == true);
      setFiltered(filteredTrue);
      return;
    }
    if (activeSell === "No sell") {
      const filteredFalse = popular.filter((pop) => pop.sell == false);
      setFiltered(filteredFalse);
      return;
    }
    if (activeSell === "Croissant") {
      const filteredCroissant = popular.sort((a, b) =>
        a.price > b.price ? 1 : -1
      );
      setFiltered(filteredCroissant);
      return;
    }
    if (activeSell === "Decroissant") {
      const filteredDecroissant = popular.sort((a, b) => b.price - a.price);
      setFiltered(filteredDecroissant);
      console.log(filteredDecroissant);
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
      <button
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
      </button>
    </div>
  );
}

export default Filter;
