import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Config from "./serviceAccountKey";

const firebaseConfig =
  process.env.NODE_ENV === "production"
    ? Config.firebaseConfigProd
    : Config.firebaseConfigDev;

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.database = app.database();
    this.auth = app.auth();
  }

  shoutoutsDb = () => this.database.ref("shoutouts");
  
  databaseTimeStamp = () => app.database.ServerValue.TIMESTAMP;

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doUpdatePassword = password => this.auth.currentUser.updatePassword(password);

  user = uid => this.database.ref(`users/${uid}`);

  users = () => this.database.ref('users');
}

export default Firebase;
