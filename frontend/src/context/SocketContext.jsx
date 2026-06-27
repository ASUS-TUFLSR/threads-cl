/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
	const [onlineUsers, setOnlineUsers] = useState([]);
	const socketRef = useRef(null);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
    const newSocket = io("/", { query: { userId: user?._id } });
    socketRef.current = newSocket;

    newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", setOnlineUsers);

    return () => newSocket.close();
}, [user?._id]);

	return (
		// eslint-disable-next-line react-hooks/exhaustive-deps
		<SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};