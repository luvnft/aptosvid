import React from "react";
import CardList from "../CardList/CardList";

interface ExploreProps {
  nfts: any[]; 
  isConnected: boolean;
}

const Explore: React.FC<ExploreProps> = ({nfts, isConnected}) => {
  console.log(nfts, isConnected);
  return (
    <div> 
      {isConnected ? (
        <CardList userNFTs={nfts}/>
      ) : (
        <div>
          <p>Connect your wallet</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
