import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";
import IconRisk from "../../assets/risk-icon.svg";
import IconGoogle from "../../assets/google-sign-in.svg";
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
					<p className={styles.popup__txt}>
						Please be polite to other users when chatting. You must create an account or sign in to continue using the site.
					</p>
				</div>
				<button
					onClick={googleSignIn}
					className={`${styles.btn} ${styles.btn_mid}`}
					style={{display: "flex"}}
				>
					<img src={IconGoogle} className={styles.btn__icon} />
					<p style={{margin: ".375rem"}}>Sign in with Google</p>
				</button>
			</div>
		</dialog>
	);
}

export default SignInDialog;
