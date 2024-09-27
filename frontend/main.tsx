import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import App from "@/App.tsx";
import {AptosWalletAdapterProvider} from "@aptos-labs/wallet-adapter-react";

const queryClient = new QueryClient();

const wallets = [new PetraWallet()]

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AptosWalletAdapterProvider>
  </React.StrictMode>,
);
