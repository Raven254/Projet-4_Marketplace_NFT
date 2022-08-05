const { NFTStorage } = require("nft.storage/dist/bundle.esm.min.js");

//apiKey : récupérer peut être la key dans .en
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAwN2I4NjhhMjE2OUE2MjA5OThjODZENmRhYWEwRGRhN0FBNDJhNDEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTUzOTM3NTY4MSwibmFtZSI6Ik1hcmtldHBsYWNlTkZUIn0.LqTPGBuDi7TsOcjSTm2ofGCNZju67fsJECn-PE0fEZQ";
const Upload = () => {
  const client = new NFTStorage({ token: apiKey });
  console.log(client);

  // Fonction d'upload sur IPFS en prenant l'image de l'utilisateur pour créer une collection.
  const uploadIPFS = async () => {
    console.log(document.getElementById("imageNFT"));
    const imageFiles = document.getElementById("imageNFT").files;
    const image = imageFiles[0];
    const name = "NFT"; // On peut mettre le nom de la collection OU le counter du NFT mais complexe...
    //const name = document.getElementById("name").value;

    console.log(imageFiles);
    console.log(image);
    const cid = await client.storeDirectory([new File([image], name)]);

    console.log(cid);

    // retourne le tokenURI complet !
    const uri = "https://" + cid + ".ipfs.nftstorage.link/" + name;
    console.log(uri);
  };

  return (
    <>
      <input
        type="text"
        id="name"
        placeholder="Ajoutez un nom à votre collection."
      />
      <br />
      <input
        type="file"
        id="imageNFT"
        placeholder="Ajoutez votre image."
        accept="image/png, image/jpeg"
      />
      <br />
      <button
        onClick={() => {
          uploadIPFS();
        }}
      >
        Mint
      </button>
    </>
  );
};

export default Upload;
