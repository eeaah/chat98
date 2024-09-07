import { useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { LRUCache } from "lru-cache";
import KaomojiOption from "./KaomojiOption";
import { kaomojiList } from "./kaomojiList.js";
import {
	IconArrowsLeft,
	IconClearFormatting,
	IconBold,
	IconItalic,
	IconStrikethrough,
	IconUnderline,
	IconHighlight,
	IconTextColor,
} from "@tabler/icons-react";
import styles from "./MessageBox.module.css";

const cache = new LRUCache({ max: 20 });

const kaomojiButtons = [
	{ id: 0, label: "Presets" },
	{ id: 1, label: "Recent" },
	{ id: 2, label: "Mouth" },
	{ id: 3, label: "Eyes" },
	{ id: 4, label: "Body" },
];

const tagPattern = /\[([A-Z]+)(?:#[0-9A-Fa-f]{6})?\]([\s\S]*?)\[\/\1\]/gi;

function MessageBox({ userDetails }) {
	const [message, setMessage] = useState("");
	const [kaomojiTab, setKaomojiTab] = useState(0);
	const [color, setColor] = useState("#000000");
	const [currentKaomoji, setCurrentKaomoji] = useState([
		"(",
		"＾",
		"▽",
		"＾",
		")",
	]);
	const [recentKaomoji, setRecentKaomoji] = useState([""]);

	const handleKaomojiTab = (event) => {
		setKaomojiTab(Number(event.target.id));
	};

	const removeFormat = (text) => {
		return text.replace(tagPattern, (match, tag, content) => {
				return content;
		});
	};
	
	const handleFormBtn = (val) => {
		const area = document.getElementById("messageInput");
		const start = area.selectionStart;
		const end = area.selectionEnd;
		const left = message.slice(0, start);
		const mid = message.slice(start, end);
		const right = message.slice(end);
		if (val == "C" || val == "H")
			setMessage(`${left}[${val}${color}]${mid}[/${val}]${right}`);
		else if (val == "F") {
			if (mid)
				setMessage(`${left}${removeFormat(mid)}${right}`);
			else
				setMessage(removeFormat(message));
		}
		else setMessage(`${left}[${val}]${mid}[/${val}]${right}`);
	};

	const handleColor = (event) => {
		setColor(event.target.value);
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
		const cur = currentKaomoji.join("");
		setMessage(message + cur);
		handleRecent(cur);
	};

	const handleRecent = (cur) => {
		cache.set(cur, cur);
		setRecentKaomoji([...cache.keys()]);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			sendMessage();
		}
	};

	const sendKaomoji = (text) => {
		let newFace = null;
		switch (kaomojiTab) {
			case 0:
				setMessage(message + text);
				handleRecent(text);
				break;
			case 1:
				setMessage(message + text);
				handleRecent(text);
				break;
			case 2:
				newFace = [
					...currentKaomoji.slice(0, 2),
					text,
					...currentKaomoji.slice(3),
				];
				setCurrentKaomoji(newFace);
				break;
			case 3:
				newFace = [
					...currentKaomoji.slice(0, 1),
					text[0],
					...currentKaomoji.slice(2, 3),
					text[1],
					...currentKaomoji.slice(4),
				];
				setCurrentKaomoji(newFace);
				break;
			case 4:
				newFace = [text[0], ...currentKaomoji.slice(1, 4), text[1]];
				setCurrentKaomoji(newFace);
				break;
		}
	};

	return (
		<div className={styles.form}>
			<label htmlFor="messageInput" hidden>
				Enter Message
			</label>
			<div className={`${styles.flex} ${styles.form__width}`}>
				<div className={styles.flex_row}>
					<button
						onClick={() => {
							handleFormBtn("F");
						}}
						className={styles.form__btn}
					>
						<IconClearFormatting className={styles.svg} />
					</button>
					<button
						onClick={() => {
							handleFormBtn("B");
						}}
						className={`${styles.form__btn} ${styles.form__btn_margin}`}
					>
						<IconBold className={styles.svg} />
					</button>
					<button
						onClick={() => {
							handleFormBtn("I");
						}}
						className={styles.form__btn}
					>
						<IconItalic className={styles.svg} />
					</button>
					<button
						onClick={() => {
							handleFormBtn("U");
						}}
						className={styles.form__btn}
					>
						<IconUnderline className={styles.svg} />
					</button>
					<button
						onClick={() => {
							handleFormBtn("S");
						}}
						className={styles.form__btn}
					>
						<IconStrikethrough className={styles.svg} />
					</button>
					<button
						onClick={() => {
							handleFormBtn("H");
						}}
						className={`${styles.form__btn} ${styles.form__btn_margin}`}
					>
						<IconHighlight className={styles.svg} />
					</button>
					<button
						onClick={() => {
							handleFormBtn("C");
						}}
						className={styles.form__btn}
					>
						<IconTextColor className={styles.svg} />
					</button>
					<button className={styles.form__btn}>
						<input
							type="color"
							className={styles.color_picker}
							value={color}
							onChange={handleColor}
						/>
					</button>
				</div>
				<textarea
					id="messageInput"
					name="messageInput"
					type="text"
					maxLength="512"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					className={styles.form__input}
				></textarea>
			</div>
			<div className={styles.flex}>
				<button
					onClick={() => sendMessage()}
					className={styles.btn}
					style={{ marginTop: "2.625rem" }}
				>
					Send
				</button>
				<button className={styles.btn}>Preview</button>
				<button onClick={sendCurKaomoji} className={styles.btn}>
					{currentKaomoji}
				</button>
			</div>
			<IconArrowsLeft className={styles.arrow} />
			<div className={`${styles.flex} ${styles.kaomoji_container}`}>
				{kaomojiButtons.map((button) => (
					<button
						key={button.id}
						id={button.id}
						onClick={handleKaomojiTab}
						className={`${styles.kaomoji_tab} ${
							kaomojiTab === button.id
								? styles.kaomoji_tab_active
								: ""
						}`}
					>
						{button.label}
					</button>
				))}
			</div>
			<div
				className={`${styles.kaomoji_field} ${
					kaomojiTab === 1 ? styles.kaomoji_field_recent : ""
				}`}
			>
				{kaomojiTab !== 1
					? kaomojiList[kaomojiTab]?.map((text, index) => (
							<KaomojiOption
								text={text}
								index={index}
								key={index}
								tab={kaomojiTab}
								sendKaomoji={sendKaomoji}
							/>
					  ))
					: recentKaomoji?.map((text, index) => (
							<KaomojiOption
								text={text}
								index={index}
								key={index}
								tab={kaomojiTab}
								sendKaomoji={sendKaomoji}
							/>
					  ))}
			</div>
		</div>
	);
}
export default MessageBox;
