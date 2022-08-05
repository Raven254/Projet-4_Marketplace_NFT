const { NFTStorage } = require('nft.storage/dist/bundle.esm.min.js');

const apiKey = process.env["NFT_STORAGE_KEY"]
const Upload = () => {
  const client = new NFTStorage({ token: apiKey })
  console.log(client);

  // Fonction d'upload sur IPFS
  const uploadIPFS = async () => {
  const image = document.getElementById("imageNFT").files;
  console.log(image);
  const cid = await client.storeDirectory([
    new File([image], "NFT")
    ])
    console.log(cid); // CID de l'image upload
  }
  
  return (
    <>
        <input type="file" id="imageNFT" placeholder="Ajoutez votre image." accept="image/png, image/jpeg"/>
        <br/>
        <button onClick={ () => {uploadIPFS()}}>Mint</button>
    </>
  )

}

export default Upload;