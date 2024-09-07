import { auth } from "../../firebase";
import { IconX, IconUser, IconUserX, IconDots } from "@tabler/icons-react";
import styles from "./Navbar.module.css";

function Navbar({ toggleUserSettings, togglePreferences, user }) {
	const signOut = () => {
		auth.signOut();
	};

	return (
		<div className={styles.nav}>
			<p className={styles.nav__text}>General - Chat98</p>
			<button className={`${styles.nav__btn} ${styles.nav__btn_left}`} onClick={togglePreferences}>
				<IconDots className={styles.nav__btn__icon} />
			</button>
			<button className={`${styles.nav__btn}`}>
				{user ? (
					<IconUser className={styles.nav__btn__icon} onClick={toggleUserSettings} />
				) : (
					<IconUserX className={styles.nav__btn__icon} />
				)}
			</button>
			<button
				className={`${styles.nav__btn} ${styles.nav__btn_right}`}
				onClick={signOut}
			>
				<IconX className={styles.nav__btn__icon} />
			</button>
		</div>
	);
}

export default Navbar;
