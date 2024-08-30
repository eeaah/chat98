import styles from "./ServerList.module.css";

function ServerList() {
	return (
		<div className={styles.servers_window} style={{marginTop: "1rem"}}>
			<div className={styles.nav}><p className={styles.nav__text}>Channels</p></div>
		</div>
	);
}

export default ServerList;
