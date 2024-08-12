import { useState } from "react";
import styles from "./MessageBox.module.css"

function KaomojiOption({ text, index }) {
	return <button className={styles.Kaomoji_option}>{text}</button>;
}

export default KaomojiOption;
