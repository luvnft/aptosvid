import { InputTransactionData } from "@aptos-labs/wallet-adapter-react"

export const moduleAddress = "0x198f16eb157f98d651123d3c227b449eefb66d90b5d7f1183755fa73a631d3da";


export const initContract = (): InputTransactionData => {
    return {
        data: {
          function: `${moduleAddress}::nftaptos::init_contract`,
          typeArguments: [],
          functionArguments: [],
        }
    }
}

// export const mintNFT = async (signAndSubmitTransaction: any, uri: string, price: number) => {
//   const payload: Types.TransactionPayload = {
//     type: "entry_function_payload",
//     function: `${moduleAddress}::nftaptos::mint_nft`,
//     type_arguments: [],
//     arguments: [uri, price],
//   };
//   const response = await signAndSubmitTransaction(payload);
//   await provider.waitForTransaction(response.hash);
// };

export type createMintArguments = {
  uri: string;
}

export const mintNFT = (args: createMintArguments): InputTransactionData => {
  const { uri} = args;

  return {
    data: {
      function: `${moduleAddress}::nftaptos::mint_nft`,
      typeArguments: [],
      functionArguments: [
        uri,
      ],
    },
  };
};

// export const getTotalCount = async () => {
//   const resource = await provider.getAccountResource(
//     moduleAddress,
//     `${moduleAddress}::nftaptos::GlobalNFTData`
//   );
//   const count = await 
//   return (resource.data as any).total_nfts;
// };

// export const getNFTById = async (id: number) => {
//   const resource = await provider.getAccountResource(
//     moduleAddress,
//     `${moduleAddress}::nftaptos::GlobalNFTData`
//   );
//   const nfts = (resource.data as any).nfts;
//   return nfts[id];
// };
