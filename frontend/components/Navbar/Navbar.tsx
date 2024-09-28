import React from "react";

interface NavbarProps {
  onRouteChange: (route: string) => void;
  isConnected: boolean;
  connect: () => void;
  address: string | null;
  isInstalled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onRouteChange, connect, isConnected, isInstalled, address }) => {
  
  const handleRedirect = () => {
    window.open('https://petra.app/', '_blank'); // Opens in a new tab
  };

  return (
    <div className="fixed z-10 backdrop-blur-sm mt-5">
      <section className="relative mx-auto">
        <nav className="flex justify-between items-center text-white w-screen px-24">
          {/* Left Side: NFT Aptos */}
          <div className="flex items-center">
            <a className="text-3xl font-bold font-heading" onClick={() => onRouteChange("home")}>
              Ignitus Network
            </a>
          </div>

          <ul className="flex space-x-12 font-semibold font-heading">
            <li>
              <a className='no-underline text-gray-200 ' onClick={() => onRouteChange("explore")}>
                Explore
              </a>
            </li>
            <li>
              <a className='no-underline text-gray-200' onClick={() => onRouteChange("mint")}>
                Mint
              </a>
            </li>
          </ul>

          <div className="flex items-center">
            {isInstalled ? (
              <button
                type="button"
                className="inline-flex items-center justify-center border-[0.5px] p-2 w-22 h-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={connect}
                disabled={isConnected}
              >
                {isConnected
                  ? address 
                    ? `${address.slice(0, 5)}...${address.slice(-4)}`
                    : "Connecting"
                  : "Connect"}
              </button>
            ) : (
              <button
                type="button"
                className="inline-flex items-center justify-center border-[0.5px] p-2 w-22 h-9 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                onClick={handleRedirect}
              >
                Install Petra Wallet
              </button>
            )}
          </div>
        </nav>
      </section>
    </div>
  );
};

export default Navbar;
