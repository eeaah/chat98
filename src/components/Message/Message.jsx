import styles from "./Message.module.css";

const formatText = (text) => {
	return text.replace(/\[B\](.*?)\[\/B\]/g, '<b>$1</b>')
};

function Message({ message }) {
	return (<div className={styles.msg}>
		<p className={styles.msg__txt} style={{color: message.nameColor}} > {"<" + message.name + ">"} </p>
		<p className={styles.msg__txt}> {message.text} </p>
	</div>);
}
export default Message;