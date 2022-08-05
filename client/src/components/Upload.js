const { NFTStorage } = require('nft.storage/dist/bundle.esm.min.js');

const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDAwN2I4NjhhMjE2OUE2MjA5OThjODZENmRhYWEwRGRhN0FBNDJhNDEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTUzOTM3NTY4MSwibmFtZSI6Ik1hcmtldHBsYWNlTkZUIn0.LqTPGBuDi7TsOcjSTm2ofGCNZju67fsJECn-PE0fEZQ";
const Upload = () => {
  const client = new NFTStorage({ token: apiKey })
  console.log(client);

  // Fonction d'upload sur IPFS en prenant l'image de l'utilisateur.
  const uploadIPFS = async () => {
  const image = document.getElementById("imageNFT").files;
  console.log(image);
  const cid = await client.storeDirectory([
    new File([image], "NFT")
    ])
    console.log(cid); // retourne un CID de l'image qu'on utilisera pour notre tokenURI.
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