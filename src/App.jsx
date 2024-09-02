import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Navbar from "./components/Navbar/Navbar";
import ChatBox from "./components/ChatBox/ChatBox";
import MessageBox from "./components/MessageBox/MessageBox";
import SignInDialog from "./components/SignInDialog/SignInDialog";
import PreferencesDialog from "./components/SignInDialog/PreferencesDialog";
import UserSettings from "./components/SignInDialog/UserSettings";
import ServerList from "./components/ServerList/ServerList";
import UserDetails from "./components/UserDetails/UserDetails";
import styles from "./App.module.css";

const defaultTheme = {
	"desktop-bg": "#FFB0E6",
	"window-bg": "#E1D9CC",
	"text": "#000000",
	"field-bg": "#ffffff",
	"button-text": "#000000",
	"indicator-accent": "#3a3a3a",
	"accent-1": "#4f46e5",
	"accent-2": "#818cf8",
	"header-text": "#ffffff",
};

function App() {
	const [user] = useAuthState(auth);
	const [userDetails, setUserDetails] = useState(null);
	const [userSettingsModal, setUserSettingsModal] = useState(false);
	const [preferencesModal, setPreferencesModal] = useState(false);
	const [viewDetails, setViewDetails] = useState(null);

	const getDetails = async () => {
		try {
			const docRef = doc(db, "users", user.uid);
			const userDoc = await getDoc(docRef);
			if (userDoc.exists()) {
				const data = userDoc.data();
				setUserDetails(data);
			} else {
				const today = new Date();
				const formattedDate = today.toISOString();
				const data = {
					name: user.displayName,
					aboutMe: "",
					nameColor: "#000000",
					joinDate: formattedDate,
					uid: user.uid,
					theme: JSON.stringify(defaultTheme),
				};
				setUserDetails(data);
				await setDoc(docRef, data);
				setUserSettingsModal(true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (user) {
			if (userDetails === null) getDetails();
		} else {
			setUserDetails(null);
		}
	}, [user]);

	Object.keys(defaultTheme).forEach((key) => {
		const cssKey = '--' + key
		document.documentElement.style.setProperty(cssKey, defaultTheme[key]);
	});

	const handleViewDetails = async (uid) => {
		try {
			const docSnap = await getDoc(doc(db, "users", uid));
			setViewDetails(docSnap.data());
		} catch (error) {
			console.error(error);
		}
	};

	const googleSignIn = async () => {
		try {
			const provider = new GoogleAuthProvider();
			signInWithPopup(auth, provider);
		} catch (error) {
			console.error(error);
		}
	};

	const toggleUserSettings = () => {
		setUserSettingsModal(!userSettingsModal);
	};

	const togglePreferences = () => {
		setPreferencesModal(!preferencesModal);
	};

	return (
		<div className={styles.page}>
			<div className={`${styles.window}`}>
				<Navbar
					toggleUserSettings={toggleUserSettings}
					togglePreferences={togglePreferences}
					user={user}
				/>
				<div className={styles.grid}>
					<div className={styles.grid__chat}>
						<ChatBox setDetails={handleViewDetails} />
					</div>
					<div className={styles.grid__message_box}>
						<MessageBox userDetails={userDetails} />
					</div>
				</div>
				{!user ? (
					<SignInDialog user={user} googleSignIn={googleSignIn} />
				) : (
					""
				)}
				{user && userDetails && userSettingsModal ? (
					<UserSettings
						user={user}
						hideModal={toggleUserSettings}
						userDetails={userDetails}
						setUserDetails={setUserDetails}
					/>
				) : (
					""
				)}
				{user && userDetails && preferencesModal ? (
					<PreferencesDialog
						user={user}
						hideModal={togglePreferences}
						userDetails={userDetails}
						setUserDetails={setUserDetails}
					/>
				) : (
					""
				)}
			</div>
			<div className={styles.right_side}>
				<ServerList />
				<UserDetails viewDetails={viewDetails} />
			</div>
		</div>
	);
}

export default App;
