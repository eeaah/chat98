import DOMPurify from 'dompurify';
import MessageText from "./MessageText";
import styles from "./Message.module.css";

function Message({ message, setDetails }) {
	return (
		<div className={styles.msg}>
			<p
				className={styles.msg__txt}
				style={{ color: message.nameColor, cursor: "pointer", flexShrink: 0 }}
				onClick={() => setDetails(message.uid)}
			>
				{" "}
				{"<" + message.name + ">"}{" "}
			</p>
			<MessageText message={message ? message.text : ""} />
		</div>
	);
}
export default Message;
