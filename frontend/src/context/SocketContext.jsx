import { createContext } from "react";

const SocketContext = createContext();

export const SocketContextProvider = ({children}) => {
    return <SocketContext.Provider value={"Hey"} >{children}</SocketContext.Provider>
}