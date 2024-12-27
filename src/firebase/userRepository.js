import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
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

export const findNewUserByEmail = async (email, currentUserUid) => {
      const foundUser = await findUserByEmail(email);
      if (!foundUser) {
        return null;
      }
  
      const userChatsRef = doc(db, "user_chats", currentUserUid);
      const userChatsSnapshot = await getDoc(userChatsRef);
  
      if (userChatsSnapshot.exists()) {
        const { chatIds = [] } = userChatsSnapshot.data();
        const chatExists = chatIds.some((chatId) =>
          chatId.includes(foundUser.id)
        );
  
        if (chatExists) {
          return null;
        }
      }
  
      return foundUser;  
  };