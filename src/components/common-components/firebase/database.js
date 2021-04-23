import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyDccjn4aW53tjHS9fTo_zrtOG0eA8jc2lw",
    authDomain: "insta-clone-2-4dd4b.firebaseapp.com",
    projectId: "insta-clone-2-4dd4b",
    storageBucket: "insta-clone-2-4dd4b.appspot.com",
    messagingSenderId: "911012622654",
    appId: "1:911012622654:web:36e414e09d0f4d1b0dbc6f"
};


const firebaseInit = firebase.initializeApp(firebaseConfig)

const db = firebaseInit.firestore()

const auth = firebase.auth()

const storage = firebase.storage()

const batch = db.batch()

export { db, auth, firebase, storage, batch }