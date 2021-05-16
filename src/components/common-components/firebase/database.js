import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyDRM6oXNZipwW_PSPhMR4HKwitWChAdtwg",
	authDomain: "instagram-cloone-869b7.firebaseapp.com",
	projectId: "instagram-cloone-869b7",
	storageBucket: "instagram-cloone-869b7.appspot.com",
	messagingSenderId: "997255234350",
	appId: "1:997255234350:web:94d89f4e966660102e70bf",
	measurementId: "G-RFHTQ34N3W",
};

let firebaseInit;
if (!firebase.apps.length) {
	firebaseInit = firebase.initializeApp(firebaseConfig);
} else {
	firebaseInit = firebase.app();
}
const db = firebaseInit.firestore();

const auth = firebase.auth();

const storage = firebase.storage();

const batch = db.batch();

export { db, auth, firebase, storage, batch };
