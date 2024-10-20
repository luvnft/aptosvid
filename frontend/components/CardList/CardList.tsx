import React from "react";
import Card from "../Card/Card";

interface NFTData {
  id: string;
  name: string;
  description: string;
  video: string;
  price:string;
}

interface CardListProps {
  userNFTs: NFTData[];
  handlePay: (id: number, url: string) => void;
  isPlaying: boolean;
}

const CardList: React.FC<CardListProps> = ({ userNFTs, handlePay, isPlaying}) => {
  console.log("isplaying:", isPlaying)

  let cardComponents: JSX.Element[] = [];
  if (userNFTs) {
    cardComponents = userNFTs.map((nft) => {
      return (
        <Card
          key={nft.id}
          id={nft.id}
          name={nft.name}
          description={nft.description}
          video={nft.video}
          price={nft.price}
          handlePay={handlePay}
          isPlaying={isPlaying}
        />
      );
    });
  }

  return (
    <div>
      {userNFTs.length === 0 ? (
        <p>No PPVs found.</p>
      ) : (
        <div className='flex flex-wrap justify-center gap-10 pb-5'>
          {cardComponents}
        </div>
      )}
    </div>
  );
};

export default CardList;
