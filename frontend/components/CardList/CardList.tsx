import React from "react";
import Card from "../Card/Card";

interface NFTData {
  id: string;
  name: string;
  description: string;
  video: string;
}

interface CardListProps {
  userNFTs: NFTData[];
}

const CardList: React.FC<CardListProps> = ({ userNFTs}) => {

  let cardComponents: JSX.Element[] = [];
  if (userNFTs) {
    cardComponents = userNFTs.map((nft) => {
      return (
        <Card
          key={nft.id}
          name={nft.name}
          description={nft.description}
          video={nft.video}
        />
      );
    });
  }

  return (
    <div>
      {userNFTs.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div className='flex flex-wrap gap-10 justify-center pb-5'>
          {cardComponents}
        </div>
      )}
    </div>
  );
};

export default CardList;
