import styles from "./Message.module.css";

function Message({ message }) {
	return (<div className={styles.msg}>
		<p className={styles.msg__txt} style={{color: message.nameColor}} > {"<" + message.name + ">"} </p>
		<p className={styles.msg__txt}> {message.text} </p>
	</div>);
}
export default Message;