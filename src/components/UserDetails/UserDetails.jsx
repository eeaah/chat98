import styles from "../ServerList/ServerList.module.css";

function UserDetails({ viewDetails }) {
	return (
		<div className={styles.servers_window}>
			<div className={styles.nav}>
				<p className={styles.nav__text}>User Details</p>
			</div>
			<div className={styles.details_box}>
				<p className={styles.txt_user} style={{color: viewDetails?.nameColor}}>{viewDetails?.name}</p>
				<p className={styles.txt_user}>
					{viewDetails?.aboutMe}
				</p>
			</div>
		</div>
	);
}

export default UserDetails;
