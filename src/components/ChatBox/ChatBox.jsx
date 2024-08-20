import { useState, useEffect, useRef } from "react";
import {
	query,
	collection,
	orderBy,
	onSnapshot,
	limit,
} from "firebase/firestore";
import { db, auth } from "../../firebase";
import Message from "../Message/Message";
import styles from "./ChatBox.module.css";

function ChatBox() {
	const chatWrapperRef = useRef(null);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const q = query(
			collection(db, "messages"),
			orderBy("createdAt", "desc"),
			limit(50)
		);
		const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
			const fetchedMessages = [];
			QuerySnapshot.forEach((doc) => {
				const data = doc.data();
				fetchedMessages.push({ ...data, id: doc.id });
			});
			const sortedMessages = fetchedMessages.reverse();
			console.log(sortedMessages);
			setMessages(sortedMessages);
		});
		return () => unsubscribe;
	}, []);

	useEffect(() => {
		if(!auth.currentUser)
			return;
		const { uid } = auth.currentUser;
		if(messages.length > 0 && messages[messages.length - 1].uid == uid) {
			if (chatWrapperRef.current) {
				chatWrapperRef.current.scrollTop = chatWrapperRef.current.scrollHeight;
			}
		}
	}, [messages]);

	return (
		<main className={styles.chat}>
			<div className={styles.chat__wrapper} id="chat-wrapper" ref={chatWrapperRef}> 
				{messages?.map((message) => (
					<Message
						key={message.id}
						message={message}
					/>
				))}
			</div>
		</main>
	);
}

export default ChatBox;
