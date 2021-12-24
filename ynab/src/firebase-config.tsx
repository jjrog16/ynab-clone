// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvzDpQwiK90qaRH0fOmoE-JfsA9PTs5Bk",
  authDomain: "ynab-clone.firebaseapp.com",
  databaseURL: "https://ynab-clone-default-rtdb.firebaseio.com",
  projectId: "ynab-clone",
  storageBucket: "ynab-clone.appspot.com",
  messagingSenderId: "372237954541",
  appId: "1:372237954541:web:0f3b70c9baee050c848be4",
};

export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return firebaseConfig;
  }
}
