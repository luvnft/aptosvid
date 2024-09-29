import React from "react";
import CardList from "../CardList/CardList";

interface ExploreProps {
  nfts: any[];
  isConnected: boolean;
  isLoading: boolean;
  canPlay: boolean;
  handlePay: (id: number, url: string) => void;
  url: string | null;
  handleCloseVideo: () => void;
}

const Explore: React.FC<ExploreProps> = ({ nfts, isConnected, isLoading, canPlay, handlePay, url, handleCloseVideo }) => {

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen w-full">
      {canPlay && url && (
        <div className="flex flex-col ml-4 items-center justify-center relative">
        <div className="bg-gray-900 p-4">
          <video
            controls
            className="w-full h-auto rounded-lg"
            src={url}
            >
            Your browser does not support the video tag.
          </video>
        </div>
          <button
            onClick={handleCloseVideo}
            className="mt-2 text-white bg-red-500 rounded-full px-3 py-1 hover:bg-red-600"
          >
            Close
          </button>
            </div>
      )}

      <div className={`flex-grow ${canPlay ? '' : 'w-full'} transition-all`}>
        {isConnected ? (
          isLoading ? (
            <div className="text-center">
            <p className="text-white text-xl">Loading...</p>
          </div>
          ) : (
            <CardList userNFTs={nfts} handlePay={handlePay} isPlaying={canPlay} />
          )
        ) : (
          <div className="text-center">
            <p className="text-white text-lg">Connect your wallet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
