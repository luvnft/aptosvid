import React from "react";
// import "./Card.css";
import "../../App.css"
interface CardProps {
  name: string;
  video: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ name, video, description }) => {



  return (
    <div className="card-container">
      <div className="card-div">
        <div className='card-inner p-2'>
          <img className='object-cover w-[230px] h-[230px] rounded overflow-hidden' alt="NFT" src={video} />
        <div className='flex flex-col justify-center items-center'>
          <div className="card-content">
            <p className="text-white text-3xl mt-3">{name}</p>
            <p className='text-white mx-2 mt-2'>{description}</p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Card;