import { useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import KaomojiOption from "./KaomojiOption";
import { kaomojiList } from "./kaomojiList.js";
import styles from "./MessageBox.module.css";

function MessageBox({ userDetails }) {
	const [message, setMessage] = useState("");
	const [kaomojiTab, setKaomojiTab] = useState(0);

	const handleKaomojiTab = (event) => {
		setKaomojiTab(event.target.id);
	};

	const sendMessage = async () => {
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
		<div className={styles.form}>
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
				<button className={styles.btn} onClick={() => sendMessage()}>
					Send
				</button>
				<button className={styles.btn}>Preview</button>
				<button className={styles.btn}>◕ ◡ ◕</button>
			</div>
			<div className={`${styles.flex} ${styles.kaomoji_container}`}>
				<button
					id={0}
					onClick={handleKaomojiTab}
					className={`${styles.kaomoji_tab} ${
						kaomojiTab == 0 ? styles.kaomoji_tab_active : ""
					}`}
				>
					Presets
				</button>
				<button
					id={1}
					onClick={handleKaomojiTab}
					className={`${styles.kaomoji_tab} ${
						kaomojiTab == 1 ? styles.kaomoji_tab_active : ""
					}`}
				>
					Mouth
				</button>
				<button
					id={2}
					onClick={handleKaomojiTab}
					className={`${styles.kaomoji_tab} ${
						kaomojiTab == 2 ? styles.kaomoji_tab_active : ""
					}`}
				>
					Eyes
				</button>
				<button
					id={3}
					onClick={handleKaomojiTab}
					className={`${styles.kaomoji_tab} ${
						kaomojiTab == 3 ? styles.kaomoji_tab_active : ""
					}`}
				>
					Body
				</button>
				<button
					id={4}
					onClick={handleKaomojiTab}
					className={`${styles.kaomoji_tab} ${
						kaomojiTab == 4 ? styles.kaomoji_tab_active : ""
					}`}
				>
					Arms
				</button>
			</div>
			<div className={styles.kaomoji_field}>
				{kaomojiList[0]?.map((text, index) => (<KaomojiOption text={text} index={index}/>))}
			</div>
		</div>
	);
}
export default MessageBox;
