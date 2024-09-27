import React, { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Navbar from "./components/Navbar/Navbar";
import { moduleAddress, initContract, mintNFT } from "./utils/aptos.ts";
import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { NETWORK } from "./constants.ts";
import Scroll from "./components/Scroll/Scroll.tsx";
import Explore from "./components/Explore/Explore.tsx";
import Mint from "./components/Mint/Mint.tsx";
import MyNFT from "./components/MyNFT/MyNFT.tsx";
import { useQueryClient } from "@tanstack/react-query";
import jws from "./contract/key.json";
import { PinataSDK } from 'pinata-web3';
import Notification from "./components/Notification/Notification.tsx";

interface AppState {
  route: string;
  address: string | null;
  isInstalled: boolean;
  shouldFetchNFTs: boolean;
  nfts: any[];
  notification: { message: string, type: 'success' | 'error' | 'loading' } | null;
}


// OWNER OF THE SMART CONTRACT
const VITE_APP_ADMIN="0x198f16eb157f98d651123d3c227b449eefb66d90b5d7f1183755fa73a631d3da";

const pinata = new PinataSDK({
  pinataJwt: jws.jws,
  pinataGateway: "beige-sophisticated-baboon-74.mypinata.cloud",
});

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    route: "explore",
    address: null,
    isInstalled: false,
    shouldFetchNFTs: true,
    nfts: [],
    notification: null,
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
          setState(prev => ({
            ...prev,
            notification: { message: 'Loading NFTs...', type: 'loading' }
          }));

          const countRes = await aptos.view<[number]>({
            payload: {
              function: `${moduleAddress}::nftaptos::get_total_count`,
              functionArguments: [],
            },
          });
          const count = countRes[0];

          const nfts: any[] = [];

          for(let i =0; i<count; i++ ){
            const nftsRes = await aptos.view<[{ id: number, owner: string, uri: string }]>( {
              payload: {
                  function: `${moduleAddress}::nftaptos::get_nft_by_id`,
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

          
          setState(prev => ({ ...prev, shouldFetchNFTs: false, nfts }));
          setState(prev => ({
            ...prev,
            notification: { message: 'NFTs loaded', type: 'success' }
          }));
        } catch (error) {
          console.error('Error fetching NFTs:', error);
          setState(prev => ({
            ...prev,
            notification: { message: 'Error fetching NFTs', type: 'error' }
          }));
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

  const mintNFTs = async (_uri: string) => {
    if(!account || !signAndSubmitTransaction) return;
    try {
      // PLEASE MAKE A UTIL FOLDER FOR THIS
      const response = await signAndSubmitTransaction(
        mintNFT({uri: _uri}),
      );

      await aptos.waitForTransaction({transactionHash: response.hash});
      queryClient.invalidateQueries();
      
      setState(prev => ({
        ...prev,
        notification: { message: 'Minting successful!', type: 'success' },
        shouldFetchNFTs: true 
      }));

      onRouteChange("explore");
    } catch (e) {
      console.log(e)
      setState(prev => ({
        ...prev,
        notification: { message: 'Error minting NFT', type: 'error' }
      }));
    }
  }

  const uploadToPinata = async (file: File, name: string, description: string): Promise<string> => {
    if (!file) {
      throw new Error("File is required");
    }

    try {
      const uploadImage = await pinata.upload.file(file);
      const metadata = await pinata.upload.json({
        name: name,
        description: description,
        video: `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${uploadImage.IpfsHash}`,
      });

      return metadata.IpfsHash;
    } catch (error) {
      console.error("Error uploading to Pinata:", error);
      throw new Error("Upload to Pinata failed.");
    }
  };


  return (
    <div>
      <Navbar
        onRouteChange={onRouteChange}
        isConnected={connected}
        connect={onConnect}
        address={address} 
        isInstalled={state.isInstalled}
      />
      {
        address === VITE_APP_ADMIN && 
          <div>
            <button onClick={initContractFtn}>Init contract</button>
          </div>
      }
      {state.route === "explore" ? (
        <Scroll>
          <Explore nfts={state.nfts} isConnected={connected}/>
        </Scroll>
      ) : state.route === "mint" ? (
        <Mint uploadToPinata={uploadToPinata} mintNFT={mintNFTs} />
      ) : (
        <MyNFT 
          myNfts={state.nfts} 
          isConnected={connected} 
          userAddress={address}
        />
      )}
      {state.notification && (
        <Notification
          message={state.notification.message}
          type={state.notification.type}
          onClose={() => setState(prev => ({ ...prev, notification: null }))}
        />
      )}
    </div>
  );
};

export default App;
