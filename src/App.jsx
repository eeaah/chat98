import { useState } from "react";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Navbar from "./components/Navbar/Navbar";
import ChatBox from "./components/ChatBox/ChatBox";
import MessageBox from "./components/MessageBox/MessageBox";
import SignInDialog from "./components/SignInDialog/SignInDialog";
import UserSettings from "./components/SignInDialog/UserSettings";
import styles from "./App.module.css";

function App() {
	const [user] = useAuthState(auth);
	const [userDetails, setUserDetails] = useState(null);
	const [userSettingsModal, setUserSettingsModal] = useState(false);

	const googleSignIn = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const res = await signInWithPopup(auth, provider);
			const uid = res.user.uid;
			const docRef = doc(db, "users", uid);
			const userDoc = await getDoc(docRef);
			if (!userDoc.exists()) {
				const data = {
					name: res.user.displayName,
					aboutMe: "",
					nameColor: "#000000",
					uid: uid,
				};
				setUserDetails(data);
				await setDoc(docRef, data);
				setUserSettingsModal(true);
			} else {
				const docSnap = await getDoc(doc(db, "users", uid));
				console.log(docSnap.data);
				const data = docSnap.data();
				setUserDetails(data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const toggleUserSettings = () => {
		setUserSettingsModal(!userSettingsModal);
	};

	return (
		<div className={`${styles.page}`}>
			<Navbar toggleUserSettings={toggleUserSettings} user={user} />
			<div className={styles.grid}>
				<div className={styles.grid__chat}>
					<ChatBox />
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
		</div>
	);
}

export default App;
