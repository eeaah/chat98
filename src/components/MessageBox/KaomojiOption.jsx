import { useState } from "react";
import styles from "./MessageBox.module.css";

function KaomojiOption({ text, index, tab, sendKaomoji }) {
	let display = "";
	if(tab == 3) {
		display = text[0] + "  " + text[1];
	} else if(tab == 4) {
		display = text[0] + "     " + text[1];
	} else if(tab == 0 || tab == 2){
		display = text;
	}

	return (
		<button
			onClick={() => sendKaomoji(text)}
			className={styles.Kaomoji_option}
		>
			{display}
		</button>
	);
}

export default KaomojiOption;
