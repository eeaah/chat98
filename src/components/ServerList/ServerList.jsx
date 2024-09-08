import styles from "./ServerList.module.css";

const serverList = ["general", "games", "media", "music", "programming"];

function ServerList({ server, setServer }) {
	return (
		<div className={styles.servers_window} style={{ marginTop: "1rem" }}>
			<div className={styles.nav}>
				<p className={styles.nav__text}>Channels</p>
			</div>
			{serverList.map((name) => (
				<button
					className={`${styles.btn} ${
						server === name ? styles.btn__current : ""
					}`}
					onClick={() => setServer(name)}
				>
					{name[0].toUpperCase() + name.slice(1)}
				</button>
			))}
		</div>
	);
}

export default ServerList;
