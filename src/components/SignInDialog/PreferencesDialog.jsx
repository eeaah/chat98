import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { IconX } from "@tabler/icons-react";
import ThemeDisplay from "./ThemeDisplay";
import styles from "./SignInDialog.module.css";

function PreferencesDialog({ hideModal, user, userDetails, setUserDetails }) {
	const defaultTheme = {
		"desktop-bg": "#FFB0E6",
		"main-window-bg": "#E1D9CC",
		"popout-window-bg": "#E1D9CC",
		text: "#000000",
		"button-text": "#000000",
		"indicator-accent": "#3a3a3a",
		"field-bg": "#ffffff",
		"accent-1": "#4f46e5",
		"accent-2": "#818cf8",
		"header-text": "#ffffff",
	};
	const dialogRef = useRef(null);
	const [initialPrefs, setInitialPrefs] = useState(null);
	const [prefs, setPrefs] = useState({ ...defaultTheme });

	const handleColor = (event) => {
		const { name, value } = event.target;
		setPrefs((prev) => ({
			...prev,
			[name]: value,
		}));
		let updatedTheme = JSON.parse(userDetails["theme"]);
		updatedTheme[name] = value;
		setUserDetails((prev) => ({
			...prev,
			theme: JSON.stringify(updatedTheme),
		}));
	};

	const handleSubmit = async () => {
		const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		for (const color of Object.entries(prefs)) {
			if (!hexColorRegex.test(color[1])) return;
		}
		const theme = JSON.stringify(prefs);
		const data = {
			...userDetails,
			theme: theme,
		};
		await setDoc(doc(db, "users", user.uid), data);
		setUserDetails(data);
		hideModal();
	};

	const handleCancel = () => {
		setUserDetails((prev) => ({
			...prev,
			theme: JSON.stringify(initialPrefs),
		}));
		hideModal();
	};

	useEffect(() => {
		try {
			const prefs = JSON.parse(userDetails.theme);
			setPrefs(prefs);
			setInitialPrefs(prefs);
		} catch (error) {
			console.error(error);
		}
		dialogRef.current?.showModal();
	}, []);

	return (
		<dialog className={styles.modal__preferences} ref={dialogRef}>
			<div className={styles.modal__flex}>
				<div className={styles.nav}>
					<p className={styles.nav__text}>Preferences</p>
					<button
						className={`${styles.nav__btn} ${styles.nav__btn_left}`}
						onClick={handleCancel}
					>
						<IconX className={styles.nav__btn__icon} />
					</button>
				</div>
				<ThemeDisplay theme={prefs} />
				<div className={styles.theme__grid}>
					<SettingsRow
						label="Desktop background"
						name="desktop-bg"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Main window background"
						name="main-window-bg"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Popout window background"
						name="popout-window-bg"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Text"
						name="text"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Button text"
						name="button-text"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Indicator Accent"
						name="indicator-accent"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Field background"
						name="field-bg"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Accent 1"
						name="accent-1"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Accent 2"
						name="accent-2"
						save={prefs}
						handle={handleColor}
					/>
					<SettingsRow
						label="Header text"
						name="header-text"
						save={prefs}
						handle={handleColor}
					/>
					<p className={styles.win__txt}>Border style:</p>
					<select className={`${styles.settings__input}`}>
						<option value="classic">Classic</option>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
					</select>
				</div>
				<div className={styles.flex}>
					<button
						onClick={handleSubmit}
						className={`${styles.btn} ${styles.btn_ok}`}
					>
						Ok
					</button>
					<button
						onClick={handleCancel}
						className={`${styles.btn} ${styles.btn_cancel}`}
					>
						Cancel
					</button>
				</div>
			</div>
		</dialog>
	);
}

function SettingsRow({ label, name, save, handle }) {
	return (
		<>
			<p className={styles.win__txt}>{`${label}:`}</p>
			<input
				className={`${styles.settings__input} ${styles.settings__input__color}`}
				name={name}
				maxLength="7"
				value={save[name]}
				onChange={handle}
			/>

			<button className={styles.form__btn}>
				<input
					type="color"
					name={name}
					value={save[name]}
					onChange={handle}
					className={styles.color_picker}
				/>
			</button>
		</>
	);
}

export default PreferencesDialog;
