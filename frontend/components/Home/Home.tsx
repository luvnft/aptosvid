import React from 'react';
import Ar from "../../assets/Ar.svg";

interface HomeProps {
  onRouteChange: (route: string) => void;
}

const Home: React.FC<HomeProps> = ({ onRouteChange }) => {
  return (
    <div className='flex items-center justify-around max-h-screen pt-32 text-white'>
      <div className='mb-16'>
        <h1 className='text-6xl font-semibold'>
          Create and play<br />
          <span className='font-thin text-sky-400'>Video PPV</span>
        </h1>
        <button 
          onClick={() => onRouteChange("explore")}
          type="button" 
          className="text-white mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Explore All
        </button>
      </div>
      <div>
        <img src={Ar} alt="" className='h-[490px]' />
      </div>
    </div>
  );
}

export default Home;
