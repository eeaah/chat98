import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { IconX } from "@tabler/icons-react";
import styles from "./SignInDialog.module.css";

function SignInDialog({ hideModal, user, userDetails, setUserDetails }) {
	const [name, setName] = useState("");
	const [aboutMe, setAboutMe] = useState("");
	const [color, setColor] = useState("#000000");
	const dialogRef = useRef(null);

	const handleName = (event) => {
		setName(event.target.value);
	};
	const handleAboutMe = (event) => {
		setAboutMe(event.target.value);
	};
	const handleColor = (event) => {
		setColor(event.target.value);
	};
	const handleSubmit = async () => {
		const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		if (!hexColorRegex.test(color)) return;
		const data = {
			...userDetails,
			name: name,
			aboutMe: aboutMe,
			nameColor: color,
			uid: user.uid
		};
		await setDoc(doc(db, "users", user.uid), data);
		setUserDetails(data);
		hideModal();
	};

	useEffect(() => {
		try {
			setName(userDetails.name);
			setColor(userDetails.nameColor);
			setAboutMe(userDetails.aboutMe);
		} catch (error) {
			console.error(error);
		}
		dialogRef.current?.showModal();
	}, []);

	return (
		<dialog className={styles.modal} ref={dialogRef}>
			<div className={styles.modal__flex}>
				<div className={styles.nav}>
					<p className={styles.nav__text}>User Settings</p>
					<button
						className={`${styles.nav__btn} ${styles.nav__btn_left}`}
						onClick={hideModal}
					>
						<IconX className={styles.nav__btn__icon} />
					</button>
				</div>
				<div className={styles.settings__grid}>
					<p className={styles.win__txt}>Display name:</p>
					<input
						value={name}
						onChange={handleName}
						maxLength="16"
						className={`${styles.settings__input} ${styles.settings__input__name}`}
					></input>
					<p className={styles.win__txt}>About me:</p>
					<input
						value={aboutMe}
						onChange={handleAboutMe}
						maxLength="128"
						className={`${styles.settings__input} ${styles.settings__input__about_me}`}
					></input>
					<p className={styles.win__txt}>Name color:</p>
					<div>
						<input
							value={color}
							onChange={handleColor}
							maxLength="7"
							className={`${styles.settings__input} ${styles.settings__input__color}`}
						></input>
						<input
							type="color"
							value={color}
							onChange={handleColor}
							className={`${styles.settings__input} ${styles.settings__input__color_picker}`}
						></input>
					</div>
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

export default SignInDialog;
