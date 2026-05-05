// firebase/chat.ts
import firestore, {
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { authServices } from "./auth";

class ChatService {
  private chatsCollection = firestore().collection("chats");

  // ─────────────────────────────
  // ✅ GET OR CREATE CHAT
  // ─────────────────────────────
  async getOrCreateChat(currentUid: string, otherUid: string) {
    const currentUserRef = await authServices.getUserRef(currentUid);
    const otherUserRef = await authServices.getUserRef(otherUid);

    const existingChat = await this.chatsCollection
      .where("participants", "array-contains", currentUserRef)
      .get();

    const found = existingChat.docs.find((doc) => {
      const participants = doc.data().participants;
      return participants.some(
        (p: FirebaseFirestoreTypes.DocumentReference) =>
          p.path === otherUserRef?.path
      );
    });

    if (found) return found.id;

    const newChat = await this.chatsCollection.add({
      participants: [currentUserRef, otherUserRef],
      lastMessage: null,
      lastMessageTime: firestore.FieldValue.serverTimestamp(),
      lastMessageSenderId: null,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    return newChat.id;
  }

  // ─────────────────────────────
  // ✅ SEND MESSAGE (FAST + NO DELAY)
  // ─────────────────────────────
  async sendMessage(chatId: string, senderUid: string, text: string) {
    const senderRef = await authServices.getUserRef(senderUid);

    const messageRef = this.chatsCollection
      .doc(chatId)
      .collection("messages")
      .doc();

    const messageData = {
      text,
      sentBy: senderRef,
      createdAt: firestore.FieldValue.serverTimestamp(),
      isRead: false,
    };

    // 🔥 Parallel write (important)
    await Promise.all([
      messageRef.set(messageData),

      this.chatsCollection.doc(chatId).update({
        lastMessage: text,
        lastMessageTime: firestore.FieldValue.serverTimestamp(),
        lastMessageSenderId: senderUid,
      }),
    ]);
  }

  // ─────────────────────────────
  // ✅ LISTEN MESSAGES (REAL-TIME)
  // ─────────────────────────────
  listenMessages(
    chatId: string,
    callback: (messages: any[]) => void
  ) {
    return this.chatsCollection
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot(async (snapshot) => {
        const messages = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const senderSnap = await data.sentBy.get();

            return {
              id: doc.id,
              text: data.text,
              sentBy: {
                uid: senderSnap.id,
                ...senderSnap.data(),
              },
              createdAt: data.createdAt?.toDate(),
              isRead: data.isRead,
            };
          })
        );

        callback(messages);
      });
  }

  // ─────────────────────────────
  // ✅ REAL-TIME CHAT LIST (FIXED)
  // ─────────────────────────────
 listenChatsWithUnreadCount(uid: string, callback: (chats: any[]) => void) {
  let unsubscribe: any;

  authServices.getUserRef(uid).then((userRef) => {
    unsubscribe = this.chatsCollection
      .where("participants", "array-contains", userRef)
      .orderBy("lastMessageTime", "desc")
      .onSnapshot(async (snapshot) => {
        const chats = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();

            const otherParticipantRef = data.participants.find(
              (p: FirebaseFirestoreTypes.DocumentReference) =>
                p.path !== userRef?.path
            );

            const otherUserSnap = await otherParticipantRef.get();

            // ✅ FIXED unread query (SERVER SIDE)
            const unreadSnap = await this.chatsCollection
              .doc(doc.id)
              .collection("messages")
              .where("isRead", "==", false)
              .where("sentBy", "!=", userRef)
              .get();

            return {
              chatId: doc.id,
              otherUser: {
                uid: otherUserSnap.id,
                ...otherUserSnap.data(),
              },
              lastMessage: data.lastMessage,
              lastMessageTime: data.lastMessageTime?.toDate(),
              unreadCount: unreadSnap.size,
            };
          })
        );

        callback(chats);
      });
  });

  return () => {
    if (unsubscribe) unsubscribe();
  };
}

  // ─────────────────────────────
  // ✅ MARK AS READ (FULL FIX)
  // ─────────────────────────────
  async markMessagesAsRead(chatId: string, uid: string) {
    const userRef = await authServices.getUserRef(uid);

    const snapshot = await this.chatsCollection
      .doc(chatId)
      .collection("messages")
      .where("isRead", "==", false)
      .where("sentBy", "!=", userRef) // 🔥 IMPORTANT
      .get();

    if (snapshot.empty) return;

    const batch = firestore().batch();

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { isRead: true });
    });

    await batch.commit();
  }
}

export const chatService = new ChatService();