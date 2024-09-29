import React from "react";

interface CardProps {
  id: string;
  name: string;
  video: string;
  description: string;
  price: string;
  handlePay: (id: number, url: string) => void;
  isPlaying: boolean;
}

const Card: React.FC<CardProps> = ({ id, name, video, description, price, handlePay, isPlaying }) => {
  const idNum = Number(id);
  return (
    <div className="card-container">
      <div className="card-div">
        <div className='card-inner p-2'>
          <video
            className="object-cover w-[230px] h-[230px] rounded overflow-hidden"
            src={video}
            muted
            controls={false}
            autoPlay={false}
            preload="metadata"
            onClick={(e) => e.preventDefault()}
          >
          </video>
          <div className='flex flex-col justify-center items-center'>
            <div className="card-content">
              <p className="text-white text-3xl mt-3">{name}</p>
              <p className='text-white mx-2 mt-2'>{description}</p>
              { isPlaying ? (
                <></>
              ) : (              
                <button className="mt-5  mb-2 rounded border-2 hover:bg-pink-600 hover:border-pink-600 text-white font-bold py-2 px-4 rounded-lg" onClick={() => handlePay(idNum, video)}>
                  <span className="text-pink-300">Play for</span> <span className="text-sky-400">{price}</span>
                </button>
                )
              }

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
