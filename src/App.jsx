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
import ServerList from "./components/ServerList/ServerList";
import UserDetails from "./components/UserDetails/UserDetails";
import styles from "./App.module.css";

function App() {
	const [user] = useAuthState(auth);
	const [userDetails, setUserDetails] = useState(null);
	const [userSettingsModal, setUserSettingsModal] = useState(false);
	const [viewDetails, setViewDetails] = useState(null);

	const handleViewDetails = async (uid) => {
		try {
			console.log("HI")
			const docSnap = await getDoc(doc(db, "users", uid));
			setViewDetails(docSnap.data());
			console.log("YO")
		} catch (error) {
			console.error(error);
		}
	}

	const googleSignIn = async () => {
		try {
			const provider = new GoogleAuthProvider();
			const res = await signInWithPopup(auth, provider);
			const uid = res.user.uid;
			const docRef = doc(db, "users", uid);
			const userDoc = await getDoc(docRef);
			if (!userDoc.exists()) {
				const today = new Date();
				const formattedDate = today.toISOString().split('T')[0];
				const data = {
					name: res.user.displayName,
					aboutMe: "",
					nameColor: "#000000",
					joinDate: formattedDate,
					uid: uid,
				};
				setUserDetails(data);
				await setDoc(docRef, data);
				setUserSettingsModal(true);
			} else {
				console.log(userDoc.data);
				const data = userDoc.data();
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
		<div className={styles.page}>
			<div className={`${styles.window}`}>
				<Navbar toggleUserSettings={toggleUserSettings} user={user} />
				<div className={styles.grid}>
					<div className={styles.grid__chat}>
						<ChatBox setDetails={handleViewDetails}/>
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
			<div className={styles.right_side}>
				<ServerList />
				<UserDetails viewDetails={viewDetails}/>
			</div>
		</div>
	);
}

export default App;
