import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import Big from 'big.js';

export const moduleAddress = "0x82c67090745c8d17f9abd8947c222fb2b6900cdf8f2249dd7452462f43edf81f";

const convertAmountFromHumanReadableToOnChain = (value: number) => {
  const bigValue = new Big(value); 
  const result = bigValue.times(Math.pow(10, 8)); 
  return Number(result.toFixed());
};

export const initContract = (): InputTransactionData => {
    return {
        data: {
          function: `${moduleAddress}::videonft::init_contract`,
          typeArguments: [],
          functionArguments: [],
        }
    }
}

// PLEASE REMOVE BELOW, NOT NEEDED

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
  price: number;
}

export const mintNFT = (args: createMintArguments): InputTransactionData => {
  const { uri, price} = args;

  const priceToSend = convertAmountFromHumanReadableToOnChain(price)
  console.log(priceToSend," Is sending")

  return {
    data: {
      function: `${moduleAddress}::videonft::mint_nft`,
      typeArguments: [],
      functionArguments: [
        uri,
        priceToSend ? priceToSend : 0,
      ],
    },
  };
};

export type payArgument = {
  id: number;
}

export const payForPlay = (args:payArgument): InputTransactionData => {
  const {id} = args;

  const moveId = id - 1;

  return {
    data: {
      function: `${moduleAddress}::videonft::pay_for_watch`,
      typeArguments: [],
      functionArguments: [
        moveId,
      ],
    }
  }
}

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
