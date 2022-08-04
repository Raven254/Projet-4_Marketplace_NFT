import React, {useState} from 'react';
import { NFTStorage } from "nft.storage";
import { web3 } from 'web3';
const APIKEY = '<YOUR-NFTSTORAGE-API-KEY>';

const MintNFT =() => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState();
    const [imageView, setImageView] = useState();
    const [metaDataURL, setMetaDataURl] = useState();
    const [txURL, setTxURL] = useState();
    const [txStatus, setTxStatus] = useState();

    const handleFileUpload = (event) => {
        console.log("file is uploaded");
        setUploadedFile(event.target.files[0]);
        setTxStatus("");
        setImageView("");
        setMetaDataURl("");
        setTxURL("");
    }
    const mintNFTToken = async(event, uploadedFile) =>{
        event.preventDefault();
        //1. upload NFT content via NFT.storage
        const metaData = await uploadNFTContent(uploadedFile);
    }

    const uploadNFTContent = async(inputFile) =>{
        const nftStorage = new NFTStorage({token: APIKEY,});
        try {
            setTxStatus("Uploading NFT to IPFS & Filecoin via NFT.storage.");
            const metaData = await nftStorage.store({
                name: 'Harmony NFT collection',
                description: 'This is a Harmony NFT collenction stored on IPFS & Filecoin.',
                image: inputFile
            });
            setMetaDataURl(getIPFSGatewayURL(metaData.url));
            return metaData;

        } catch (error) {
            setErrorMessage("Could not save NFT to NFT.Storage - Aborted minting.");
            console.log(error);
        }
    }

    const previewNFT = (metaData, mintNFTTx) =>{
      // à voir
    }

    const getIPFSGatewayURL = (ipfsURL)=>{
        let urlArray = ipfsURL.split("/");
        let ipfsGateWayURL = `https://${urlArray[2]}.ipfs.dweb.link/${urlArray[3]}`;
        return ipfsGateWayURL;
    }

    return(
        <div className='MintNFT'>
            <form>
                <h3>Veuillez upload votre image ici :</h3>
                <input type="file" onChange={handleFileUpload}></input>
                <button onClick={e=>mintNFTToken(e, uploadedFile)}>Mint NFT</button>
            </form>
            {txStatus && <p>{txStatus}</p>}
            {imageView && <img className='NFTImg' src={imageView} alt="NFT preview"/>}
            {metaDataURL && <p><a href={metaDataURL}>Metadata sur IPFS</a></p>}
            {errorMessage}
        </div>
        
    );
}
export default MintNFT;