import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { IconX } from "@tabler/icons-react";
import styles from "./SignInDialog.module.css";

function PreferencesDialog({ hideModal, user, userDetails, setUserDetails }) {
	const dialogRef = useRef(null);

	const handleSubmit = async () => {
		const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		if (!hexColorRegex.test(color)) return;
		const data = {
			...userDetails,
		};
		await setDoc(doc(db, "users", user.uid), data);
		setUserDetails(data);
		hideModal();
	};

	useEffect(() => {
		try {
			
		} catch (error) {
			console.error(error);
		}
		dialogRef.current?.showModal();
	}, []);

	return (
		<dialog className={styles.modal} ref={dialogRef}>
			<div className={styles.modal__flex}>
				<div className={styles.nav}>
					<p className={styles.nav__text}>Preferences</p>
					<button
						className={`${styles.nav__btn} ${styles.nav__btn_left}`}
						onClick={hideModal}
					>
						<IconX className={styles.nav__btn__icon} />
					</button>
				</div>
				<div className={styles.flex}>
					<button
						onClick={handleSubmit}
						className={`${styles.btn} ${styles.btn_ok}`}
					>
						Ok
					</button>
					<button
						onClick={hideModal}
						className={`${styles.btn} ${styles.btn_cancel}`}
					>
						Cancel
					</button>
				</div>
			</div>
		</dialog>
	);
}

export default PreferencesDialog;
