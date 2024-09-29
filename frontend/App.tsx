import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Navbar from "./components/Navbar/Navbar";
import { moduleAddress, initContract, mintNFT, payForPlay } from "./utils/aptos.ts";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { NETWORK } from "./constants.ts";
import Explore from "./components/Explore/Explore.tsx";
import Mint from "./components/Mint/Mint.tsx";
import { useQueryClient } from "@tanstack/react-query";
import jws from "./contract/key.json";
import { PinataSDK } from 'pinata-web3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import  Home  from "./components/Home/Home.tsx";

interface AppState {
  route: string;
  address: string | null;
  isInstalled: boolean;
  shouldFetchNFTs: boolean;
  nfts: any[];
  isLoading: boolean;
  canPlay: boolean;
  url: string | null;
}


// OWNER OF THE SMART CONTRACT
const VITE_APP_ADMIN="0x82c67090745c8d17f9abd8947c222fb2b6900cdf8f2249dd7452462f43edf81f";

const pinata = new PinataSDK({
  pinataJwt: jws.jws,
  pinataGateway: "beige-sophisticated-baboon-74.mypinata.cloud",
});

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    route: "home",
    address: null,
    isInstalled: false,
    shouldFetchNFTs: true,
    nfts: [],
    isLoading: false,
    canPlay: false,
    url: null,
  });

  const { wallets, connect, connected, account, network, signAndSubmitTransaction } = useWallet();
  const aptos = new Aptos(new AptosConfig({network: NETWORK}));
  const queryClient = useQueryClient();
  const address = connected ? account?.address || null : null;

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      if (wallets.length > 2) {
        const installed = wallets[2].readyState;
  
        console.log(installed);
  
        if (installed === "NotDetected") {
          setState(prev => ({ ...prev, isInstalled: false }));
        } else {
          setState(prev => ({ ...prev, isInstalled: true }));
        }
      } else {
        setState(prev => ({ ...prev, isInstalled: false }));
      }
    } else {
      setState(prev => ({ ...prev, isInstalled: false }));
    }
  }, [wallets]);

  useEffect(() => {
    if (network) { 
      if (network.name === "testnet") {
        console.log("You are on Testnet.");
      } else {
        alert("Please change to testnet");
      }
    } else {
      console.log("Network is undefined. Please connect to a wallet.");
    }
  }, [network, wallets]);

  useEffect(() => {
    async function getAllNFTs() {
      if (connected && address) { 
        try {
          setState(prev => ({ ...prev, isLoading: true}));
          const countRes = await aptos.view<[number]>({
            payload: {
              function: `${moduleAddress}::videonft::get_total_count`,
              functionArguments: [],
            },
          });
          const count = countRes[0];

          const nfts: any[] = [];

          for(let i =0; i<count; i++ ){
            const nftsRes = await aptos.view<[{ id: number, owner: string, uri: string }]>( {
              payload: {
                  function: `${moduleAddress}::videonft::get_nft_by_id`,
                  functionArguments: [i],
              },
            });
            const data = await pinata.gateways.get(`https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${nftsRes[0].uri}`);

            const mergedNFTData = {
              ...(typeof nftsRes[0] === 'object' ? nftsRes[0] : {}),
              ...(typeof data.data === 'object' ? data.data : {}),
            };
            nfts.push(mergedNFTData);
          }

          
          setState(prev => ({ ...prev, shouldFetchNFTs: false, nfts, isLoading: false }));
        } catch (error) {
          console.error('Error fetching NFTs:', error);
          toast.error("Error fetching NFTs", {
            position: "top-center"
          })
        }
      }
    }
    getAllNFTs();
  }, [state.shouldFetchNFTs, connected, address]);
  

  const onConnect = async () => {
    if (wallets && wallets.length > 0) {
      const petraWallet = wallets.find(wallet => wallet.name === 'Petra');
  
      if (petraWallet) {
        try {
          await connect(petraWallet.name);
        } catch (error) {
          console.error("Connection failed:", error);
        }
      } else {
        console.error("Petra wallet not found");
      }
    } else {
      console.error("No wallets available");
    }
  };

  const initContractFtn = async () => {
    // ONLY CAN INITIALIZE ONCE.
    // ONLY THE OWNER OF THE SMART CONTRACT CAN CALL THIS. IF ANY OTHER ADDRESS WILL CALL THIS FUNCTION IT WILL BREAK THE SMART CONTRACT FUNCTIONALITY 
    if (!account || !signAndSubmitTransaction) return;
    try {
      const response = await signAndSubmitTransaction(
        initContract(),
      )

      const committedTransactionResponse = await aptos.waitForTransaction({
        transactionHash: response.hash,
      })

      console.log(committedTransactionResponse)
    } catch (e) {
      console.error("Error initializing contract:", e);
    }
  };


  const onRouteChange = (route: string) => {
    setState(prev => ({ ...prev, route }));
  };

  const mintNFTs = async (_uri: string, _price: string) => {
    if(!account || !signAndSubmitTransaction) return;
    try {
      // PLEASE MAKE A UTIL FOLDER FOR THIS
      const priceInNumber = Number(_price);
      const response = await signAndSubmitTransaction(
        mintNFT({uri: _uri, price: priceInNumber}),
      );

      await aptos.waitForTransaction({transactionHash: response.hash});
      queryClient.invalidateQueries();
      
      toast.success("NFT minted successfully", {
        position: "top-center"
      });
      setState(prev => ({
        ...prev,
        shouldFetchNFTs: true 
      }));

      onRouteChange("explore");
    } catch (e) {
      console.log(e)
      toast.error('Error minting NFT:', {
        position: "top-center"
      });
    }
  }

  const handlePay = async (id: number, url: string) => {
    if(!account || !signAndSubmitTransaction) return;
    console.log("click")

    try {
      const response = await signAndSubmitTransaction(
        payForPlay({id}),
      );

      await aptos.waitForTransaction({transactionHash: response.hash});
      queryClient.invalidateQueries();

      toast.success("Please enjoy", {
        position: "top-center"
      });
      setState(prev => ({
        ...prev,
        canPlay: true,
        url,
      }));
    }catch (e) {
      console.log(e)
      toast.error('Error paying NFT:', {
        position: "top-center"
      });
    }
  }

  const handleCloseVideo = () => {
    setState(prev => ({
      ...prev,
      canPlay: false,
      url: null,
    }))
  }

  const uploadToPinata = async (file: File, name: string, description: string, price: string): Promise<string> => {
    if (!file) {
      throw new Error("File is required");
    }

    try {
      toast.info("Uploading video to IPFS", {
        position:"top-center"
      })
      const uploadImage = await pinata.upload.file(file);
      const metadata = await pinata.upload.json({
        name: name,
        description: description,
        video: `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${uploadImage.IpfsHash}`,
        price: price
      });

      return metadata.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      toast.error("Minting NFT failed.", {
        position: "top-center"
      });
      throw new Error("Upload to Pinata failed.");
    }
  };


  return (
    <div>
      <ToastContainer />
      <div className="App min-h-screen">
        <div className='gradient-bg-welcome h-screen w-screen'>
          <Navbar
            onRouteChange={onRouteChange}
            isConnected={connected}
            connect={onConnect}
            address={address} 
            isInstalled={state.isInstalled}
            />
            <div>

          {
            address === VITE_APP_ADMIN && 
            <div>
                <button onClick={initContractFtn}>Init contract</button>
              </div>
          }
          {state.route === "home" ? (
              <Home onRouteChange={onRouteChange}/>
          ) : state.route === "explore" ? (
              <Explore nfts={state.nfts} isConnected={connected} isLoading={state.isLoading} canPlay={state.canPlay} handlePay={handlePay} url={state.url} handleCloseVideo={handleCloseVideo}/>
          ) : state.route === "mint" ? (
              <Mint uploadToPinata={uploadToPinata} mintNFT={mintNFTs} />
          ) : (
              <>Cannot find page</>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
