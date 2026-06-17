import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const user = useRecoilValue(userAtom);

	useEffect(() => {
		if (!user?._id) return;

		const newSocket = io("http://localhost:5000", {
			query: {
				userId: user._id,
			},
		});

		setSocket(newSocket);

		newSocket.on("getOnlineUsers", (users) => {
			setOnlineUsers(users);
		});

		return () => {
			newSocket.off("getOnlineUsers")
			newSocket.disconnect();
		};
	}, [user?._id]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};