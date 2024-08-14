import { useState } from "react";
import { auth, db } from "../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
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

function MessageBox({ userDetails }) {
	const [message, setMessage] = useState("");
	const [kaomojiTab, setKaomojiTab] = useState(0);
	const [color, setColor] = useState("#000000")
	const [currentKaomoji, setCurrentKaomoji] = useState([
		"(´",
		"•",
		"ω",
		"•",
		"`)",
	]);
	const [recentKaomoji, setRecentKaomoji] = useState([]);
	const kaomojiButtons = [
		{ id: 0, label: "Presets" },
		{ id: 1, label: "Recent" },
		{ id: 2, label: "Mouth" },
		{ id: 3, label: "Eyes" },
		{ id: 4, label: "Body" },
	];

	const handleKaomojiTab = (event) => {
		setKaomojiTab(event.target.id);
	};

	const handleFormBtn = (val) => {
		const area = document.getElementById("messageInput");
		const start = area.selectionStart;
		const end = area.selectionEnd;
		const left = message.slice(0, start);
		const mid = message.slice(start, end);
		const right = message.slice(end);
		if(val == "C" || val == "H")
			setMessage(`${left}[${val}${color}]${mid}[/${val}]${right}`)
		else if(val == "F")
			console.log("clear format")
		else
			setMessage(`${left}[${val}]${mid}[/${val}]${right}`)
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
			<div className={`${styles.flex} ${styles.form__width}`}>
				<div class={styles.flex_row}>
					<button onClick={() => {handleFormBtn("F")}} className={styles.form__btn}>
						<IconClearFormatting className={styles.svg} />
					</button>
					<button onClick={() => {handleFormBtn("B")}} className={`${styles.form__btn} ${styles.form__btn_margin}`}>
						<IconBold className={styles.svg} />
					</button>
					<button onClick={() => {handleFormBtn("I")}} className={styles.form__btn}>
						<IconItalic className={styles.svg} />
					</button>
					<button onClick={() => {handleFormBtn("U")}} className={styles.form__btn}>
						<IconUnderline className={styles.svg} />
					</button>
					<button onClick={() => {handleFormBtn("S")}} className={styles.form__btn}>
						<IconStrikethrough className={styles.svg} />
					</button>
					<button onClick={() => {handleFormBtn("H")}} className={`${styles.form__btn} ${styles.form__btn_margin}`}>
						<IconHighlight className={styles.svg} />
					</button>
					<button onClick={() => {handleFormBtn("C")}} className={styles.form__btn}>
						<IconTextColor className={styles.svg} />
					</button>
					<button className={styles.form__btn}>
						<input type="color" className={styles.color_picker} value={color} onChange={handleColor} />
					</button>
				</div>
				<textarea
					id="messageInput"
					name="messageInput"
					type="text"
					maxlength="256"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					className={styles.form__input}
				></textarea>
			</div>
			<div className={styles.flex}>
				<button onClick={() => sendMessage()} className={styles.btn} style={{marginTop: "2.625rem"}}>
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
							kaomojiTab == button.id
								? styles.kaomoji_tab_active
								: ""
						}`}
					>
						{button.label}
					</button>
				))}
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
