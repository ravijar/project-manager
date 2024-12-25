import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const findUserByEmail = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.trim()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
    } else {
        return null;
    }
};
