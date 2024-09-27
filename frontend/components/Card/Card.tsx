import React from "react";
import "./Card.css";

interface CardProps {
  name: string;
  video: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ name, video, description }) => {



  return (
    <div className="card-container">
      <img className="card-image" alt="NFT" src={video} />
      <div className="card-details">
        <p>{name}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Card;