import { connectAuthEmulator, getAuth } from "firebase/auth"; // Firebase v9+
import { connectFunctionsEmulator, getFunctions } from "@firebase/functions";
import {
  AuthProvider,
  FirestoreProvider,
  FunctionsProvider,
  useFirebaseApp,
} from "reactfire";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const FirebaseContainer = ({ children }) => {
  const app = useFirebaseApp();
  if (!app) return null;

  const auth = getAuth(app);
  const db = getFirestore(app);
  const functions = getFunctions(app);
  const firestore = getFirestore(app);

  if (import.meta.env["VITE_EMULATE"] === "true") {
    connectFirestoreEmulator(db, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFunctionsEmulator(functions, "localhost", 5001);
  }

  return (
    <AuthProvider sdk={auth}>
      <FunctionsProvider sdk={functions}>
        <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>
      </FunctionsProvider>
    </AuthProvider>
  );
};

export default FirebaseContainer;
