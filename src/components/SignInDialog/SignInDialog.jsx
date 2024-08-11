import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";
import IconRisk from "../../assets/risk-icon.svg";
import styles from "./SignInDialog.module.css";

function SignInDialog({ user, googleSignIn }) {
	const dialogRef = useRef(null)

	useEffect(() => {
		if (!user) {
			dialogRef.current?.showModal();
		} else {
			dialogRef.current?.close();
		}
	}, [user]);

	return (
		<dialog className={styles.modal} ref={dialogRef}>
			<div className={styles.modal__flex}>
				<div className={styles.nav}>
					<p className={styles.nav__text}>Warning</p>
					<button
						className={`${styles.nav__btn} ${styles.nav__btn_left}`}
					>
						<IconX className={styles.nav__btn__icon} />
					</button>
				</div>
				<div className={styles.win__txt_box}>
					<img src={IconRisk} className={styles.win__icon_risk} />
					<p className={styles.win__txt}>
						Please sign in with Google to continue using the app.
					</p>
				</div>
				<button
					onClick={googleSignIn}
					className={`${styles.btn} ${styles.btn_mid}`}
				>
					Sign in with Google
				</button>
			</div>
		</dialog>
	);
}

export default SignInDialog;
