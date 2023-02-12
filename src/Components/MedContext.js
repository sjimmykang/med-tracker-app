import React, { createContext, useState } from "react";

export const MedContext = createContext();

const AppContext = ({ children }) => {
    const [ testState, setTestState ] = useState('testerState!!');
    return (
        <MedContext.Provider value={{
            testState
        }} >
            {children}
        </MedContext.Provider>
    );
};

export default AppContext;