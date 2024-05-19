// ZipCodeContext.js
import React, { createContext, useState, useContext } from 'react';

const ZipCodeContext = createContext();

export const ZipCodeProvider = ({ children }) => {
  const [zipCodeInfo, setZipCodeInfo] = useState({
    county: "台北市",
    district: "",
    zipCode: ""
  });

  return (
    <ZipCodeContext.Provider value={{ zipCodeInfo, setZipCodeInfo }}>
      {children}
    </ZipCodeContext.Provider>
  );
};

export const useZipCode = () => useContext(ZipCodeContext);
