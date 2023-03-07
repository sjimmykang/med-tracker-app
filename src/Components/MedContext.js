import React, { createContext } from "react";

export const MedContext = createContext();

const AppContext = ({ children }) => {
    // const [ testState, setTestState ] = useState('testerState!!');
    return (
        <MedContext.Provider value={{
        }} >
            {children}
        </MedContext.Provider>
    );
};

export default AppContext;