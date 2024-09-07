import DOMPurify from "dompurify";
import styles from "./Message.module.css";

const tagMap = {
	B: "strong",
	I: "em",
	U: "u",
	S: "s",
	H: "span",
	C: "span",
};

const tagPattern = /\[([A-Z]+)(#[0-9A-Fa-f]{6})?\](.*?)\[\/\1\]/gi;

function MessageText({ message }) {
	const formatText = (text) => {
		const singleLine = text.replace(/(\r\n|\n|\r)/gm, "");
		return singleLine.replace(
			tagPattern,
			(match, tag, colorCode, content) => {
				const htmlTag = tagMap[tag.toUpperCase()];
				if (htmlTag) {
					if (tag.toUpperCase() === "H" && colorCode) {
						return `<${htmlTag} style="background: ${colorCode}">${content}</${htmlTag}>`;
					} else if (tag.toUpperCase() === "C" && colorCode) {
						return `<${htmlTag} style="color: ${colorCode}">${content}</${htmlTag}>`;
					}
					return `<${htmlTag}>${content}</${htmlTag}>`;
				}
				return match;
			}
		);
	};
	const parsedText = DOMPurify.sanitize(formatText(message));

	return (
		<div
			dangerouslySetInnerHTML={{ __html: parsedText }}
			className={styles.msg__txt}
		/>
	);
}
export default MessageText;
