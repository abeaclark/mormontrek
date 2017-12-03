import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyC2aTrhdzP2JkHzq5952XtSpCSYPMdIQTA",
    authDomain: "mormontrek.firebaseapp.com",
    databaseURL: "https://mormontrek.firebaseio.com",
}

firebase.initializeApp(config)

export const db = firebase.database()
export const firebaseAuth = firebase.auth