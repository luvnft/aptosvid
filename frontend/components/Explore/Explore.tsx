import React from "react";
import CardList from "../CardList/CardList";

interface ExploreProps {
  nfts: any[];
  isConnected: boolean;
  isLoading: boolean;
}

const Explore: React.FC<ExploreProps> = ({ nfts, isConnected, isLoading }) => {
  console.log(nfts, isConnected);
  
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      {isConnected ? (
        isLoading ? (
          <p className="text-white text-xl">Loading...</p>
        ) : (
          <CardList userNFTs={nfts} />
        )
      ) : (
        <div className="text-center">
          <p className="text-white text-lg">Connect your wallet</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
