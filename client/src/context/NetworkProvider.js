import React, { createContext, useState, useEffect } from 'react';

const NetworkContext = createContext("devnet"); // Tạo context với giá trị mặc định là "devnet"

export const NetworkProvider = ({ children }) => {
  const [network, setNetwork] = useState("devnet");
  const [wallID, setWallID] = useState(null);
  // useEffect(() => {
  //   window.location.reload();
  // }, [wallID]);
  return (
    <NetworkContext.Provider value={{ network, setNetwork, wallID, setWallID }}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContext;
