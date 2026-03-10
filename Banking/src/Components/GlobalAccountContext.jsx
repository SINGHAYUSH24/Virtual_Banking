import {createContext, useContext,useState} from "react";
export const AccountContext=createContext(null);
function GlobalAccountContext({children}){
    const [accounts,setGlobalAccounts]=useState([]);
    return(
        <AccountContext.Provider value={{accounts,setGlobalAccounts}}>
        {children}
        </AccountContext.Provider>
    );
}
export default GlobalAccountContext;