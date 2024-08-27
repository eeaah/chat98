import styles from "../ServerList/ServerList.module.css";

function UserDetails({ userDetails }) {
	return (
		<div className={styles.servers_window}>
			<div className={styles.nav}>
				<p className={styles.nav__text}>User Details</p>
			</div>
			<div className={styles.details_box}>
				<p className={styles.txt_user}>username1</p>
				<p>
					dasfsdacvb dfg dfsg dasfsdacvb dfg dfsg dasfsdacvb dfg dfsg
					dasfsdacvb dfg dfsg dasfsdacvb dfg dfsg dasfsdacvb dfg dfsg
					dasfsdac
				</p>
			</div>
		</div>
	);
}

export default UserDetails;
