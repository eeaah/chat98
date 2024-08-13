import { useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import KaomojiOption from "./KaomojiOption";
import { kaomojiList } from "./kaomojiList.js";
import { IconArrowsLeft } from "@tabler/icons-react";
import styles from "./MessageBox.module.css";

function MessageBox({ userDetails }) {
	const [message, setMessage] = useState("");
	const [kaomojiTab, setKaomojiTab] = useState(0);
	const [currentKaomoji, setCurrentKaomoji] = useState([
		"(´",
		"•",
		"ω",
		"•",
		"`)",
	]);
	const [recentKaomoji, setRecentKaomoji] = useState([]);

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

	const sendCurKaomoji = () => {
		setMessage(message + currentKaomoji.join(""));
		recent = recentKaomoji;
		if (recent.length > 16) {
			recent = recend.slice(0, recent.length - 1);
		}
		recent = [currentKaomoji, ...recent];
		setRecentKaomoji(recent);
	};

	const sendKaomoji = (text) => {
		if (kaomojiTab == 0) {
			setMessage(message + text);
		} else if (kaomojiTab == 2) {
			const newFace = [
				...currentKaomoji.slice(0, 2),
				text,
				...currentKaomoji.slice(3),
			];
			setCurrentKaomoji(newFace);
		} else if (kaomojiTab == 3) {
			const newFace = [
				...currentKaomoji.slice(0, 1),
				text[0],
				...currentKaomoji.slice(2, 3),
				text[1],
				...currentKaomoji.slice(4),
			];
			setCurrentKaomoji(newFace);
		} else if (kaomojiTab == 4) {
			const newFace = [text[0], ...currentKaomoji.slice(1, 4), text[1]];
			setCurrentKaomoji(newFace);
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
				maxlength="256"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className={styles.form__input}
			></textarea>
			<div className={styles.flex}>
				<button className={styles.btn} onClick={() => sendMessage()}>
					Send
				</button>
				<button className={styles.btn}>Preview</button>
				<button onClick={sendCurKaomoji} className={styles.btn}>
					{currentKaomoji}
				</button>
			</div>
			<IconArrowsLeft className={styles.arrow} />
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
					Recent
				</button>
				<button
					id={2}
					onClick={handleKaomojiTab}
					className={`${styles.kaomoji_tab} ${
						kaomojiTab == 2 ? styles.kaomoji_tab_active : ""
					}`}
				>
					Mouth
				</button>
				<button
					id={3}
					onClick={handleKaomojiTab}
					className={`${styles.kaomoji_tab} ${
						kaomojiTab == 3 ? styles.kaomoji_tab_active : ""
					}`}
				>
					Eyes
				</button>
				<button
					id={4}
					onClick={handleKaomojiTab}
					className={`${styles.kaomoji_tab} ${
						kaomojiTab == 4 ? styles.kaomoji_tab_active : ""
					}`}
				>
					Body
				</button>
			</div>
			<div className={styles.kaomoji_field}>
				{kaomojiList[kaomojiTab]?.map((text, index) => (
					<KaomojiOption
						text={text}
						index={index}
						tab={kaomojiTab}
						sendKaomoji={sendKaomoji}
					/>
				))}
			</div>
		</div>
	);
}
export default MessageBox;
