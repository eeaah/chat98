import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { IconX } from "@tabler/icons-react";
import { themeList } from "./themeList.js";
import ThemeDisplay from "./ThemeDisplay";
import styles from "./SignInDialog.module.css";

function PreferencesDialog({ hideModal, user, userDetails, setUserDetails }) {
	const defaultTheme = { ...themeList.default };
	const dialogRef = useRef(null);
	const [initialPrefs, setInitialPrefs] = useState(null);
	const [prefs, setPrefs] = useState({ ...defaultTheme });
	const [currentBorder, setCurrentBorder] = useState("classic");

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

	const handleBorder = (event) => {
		const borders = themeList.borders[event.target.value];
		setCurrentBorder(event.target.value);
		setPrefs((prev) => ({
			...prev,
			...borders,
		}));
		let updatedTheme = JSON.parse(userDetails["theme"]);
		updatedTheme = {
			...updatedTheme,
			...borders,
		};
		setUserDetails((prev) => ({
			...prev,
			theme: JSON.stringify(updatedTheme),
		}));
	};

	const handleThemeChange = (event) => {
		const theme = JSON.parse(event.target.value);
		setPrefs(theme);
		changeBorder(theme["border-2"]);
		setUserDetails((prev) => ({
			...prev,
			theme: event.target.value,
		}));
	};

	const handleSubmit = async () => {
		const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		for (const color of Object.entries(prefs)) {
			if (
				!hexColorRegex.test(color[1]) &&
				color[1] != "rgba(0, 0, 0, 0)"
			) {
				console.error(`Invalid color code: ${color}`);
				return;
			}
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

	const changeBorder = (val) => {
		switch (val) {
			case "#dfdfdf":
				setCurrentBorder("classic");
				break;
			case "#363636":
				setCurrentBorder("dark");
				break;
			case "#999999":
				setCurrentBorder("med");
				break;
			case "#E5E5E5":
				setCurrentBorder("light");
				break;
			case "rgba(0, 0, 0, 0)":
				setCurrentBorder("none");
				break;
		}
	};

	useEffect(() => {
		try {
			const prefs = JSON.parse(userDetails.theme);
			setPrefs(prefs);
			setInitialPrefs(prefs);
			changeBorder(prefs["border-2"]);
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
					<select
						className={`${styles.settings__input}`}
						onChange={handleThemeChange}
					>
						{Object.entries(themeList.themes).map(
							([key, value]) => (
								<option key={key} value={JSON.stringify(value)}>
									{key}
								</option>
							)
						)}
					</select>
				<div className={styles.theme_display}>
					<ThemeDisplay theme={prefs} />
				</div>
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
						label="Indicator accent"
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
					<select
						className={`${styles.settings__input}`}
						onChange={handleBorder}
						value={currentBorder}
					>
						{Object.entries(themeList.borders).map(
							([key, value]) => (
								<option key={key} value={key}>
									{key.charAt(0).toUpperCase() + key.slice(1)}
								</option>
							)
						)}
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
