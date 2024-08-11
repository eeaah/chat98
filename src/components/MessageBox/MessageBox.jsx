import { useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import styles from "./MessageBox.module.css";

function MessageBox({ userDetails }) {
	const [message, setMessage] = useState("");
	const sendMessage = async (event) => {
		event.preventDefault();
		try {
			if (message.trim() == "") throw "Enter a valid message";
			if (!userDetails) throw "User details not found";
			const { uid } = auth.currentUser;
			await addDoc(collection(db, "messages"), {
				text: message,
				name: userDetails.name,
				nameColor: userDetails.nameColor,
				createdAt: serverTimestamp(),
				uid,
			});
			setMessage("");
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form onSubmit={(event) => sendMessage(event)} className={styles.form}>
			<label htmlFor="messageInput" hidden>
				Enter Message
			</label>
			<textarea
				id="messageInput"
				name="messageInput"
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className={styles.form__input}
			></textarea>
			<div className={styles.flex}>
				<button className={styles.btn} type="submit">
					Send
				</button>
				<button className={styles.btn}>Preview</button>
				<button className={styles.btn}>◕ ◡ ◕</button>
			</div>
			<div>
				{/* <button></button> */}
				<fieldset className={styles.fieldset}>
					<legend className={styles.legend}>kaomoji</legend>
					emojis
				</fieldset>
			</div>
		</form>
	);
}
export default MessageBox;
