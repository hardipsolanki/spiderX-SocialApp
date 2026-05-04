// firebase/chat.ts
import { Message } from "@/types";
import firestore, {
    FirebaseFirestoreTypes
} from "@react-native-firebase/firestore";
import { authServices } from "./auth";

class ChatService {
    private chatsCollection = firestore().collection("chats");

    // ─── Chat Create અથવા Existing Return કરો ──────────────
    async getOrCreateChat(currentUid: string, otherUid: string) {
        try {
            const currentUserRef = await authServices.getUserRef(currentUid);
            const otherUserRef = await authServices.getUserRef(otherUid);

            // Check: આ બે users વચ્ચે chat already exists?
            const existingChat = await this.chatsCollection
                .where("participants", "array-contains", currentUserRef)
                .get();

            // Filter: otherUser પણ participants માં છે?
            const found = existingChat.docs.find((doc) => {
                const participants = doc.data().participants;
                return participants.some(
                    (p: FirebaseFirestoreTypes.DocumentReference) => 
                        p.path === otherUserRef?.path
                );
            });

            if (found) {
                // Already exist — same chatId return કરો
                return found.id;
            }

            // New chat create કરો
            const newChat = await this.chatsCollection.add({
                participants: [currentUserRef, otherUserRef],
                lastMessage: null,
                lastMessageTime: firestore.FieldValue.serverTimestamp(),
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            return newChat.id;

        } catch (error) {
            console.error("Error creating chat:", error);
            throw error;
        }
    }

    // ─── Message Send કરો ──────────────────────────────────
    async sendMessage(chatId: string, senderUid: string, text: string) {
        try {
            const senderRef = await authServices.getUserRef(senderUid);

            // Sub-collection માં message add કરો
            await this.chatsCollection
                .doc(chatId)
                .collection("messages")
                .add({
                    text: text,
                    sentBy: senderRef,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    isRead: false,
                });

            // Chat document માં lastMessage update કરો
            await this.chatsCollection.doc(chatId).update({
                lastMessage: text,
                lastMessageTime: firestore.FieldValue.serverTimestamp(),
            });

        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    // ─── Messages Fetch કરો — Real time ────────────────────
    listenMessages(
        chatId: string,
        callback: (messages: Message[]) => void
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
                            sentBy: senderSnap.data(),
                            createdAt: data.createdAt?.toDate(),
                            isRead: data.isRead,
                        };
                    })
                );
                callback(messages);
            });
    }

    // ─── All Chats Fetch કરો ────────────────────────────────
    async getAllChats(uid: string) {
        try {
            const userRef = await authServices.getUserRef(uid);

            const snapshot = await this.chatsCollection
                .where("participants", "array-contains", userRef)
                .orderBy("lastMessageTime", "desc")
                .get();

            const chats = await Promise.all(
                snapshot.docs.map(async (doc) => {
                    const data = doc.data();

                    // Other participant fetch કરો
                    const otherParticipantRef = data.participants.find(
                        (p: FirebaseFirestoreTypes.DocumentReference) =>
                            p.path !== userRef?.path
                    );
                    const otherUserSnap = await otherParticipantRef.get();

                    return {
                        chatId: doc.id,
                        otherUser: otherUserSnap.data(),
                        lastMessage: data.lastMessage,
                        lastMessageTime: data.lastMessageTime?.toDate(),
                    };
                })
            );

            return chats;

        } catch (error) {
            console.error("Error fetching chats:", error);
            throw error;
        }
    }
}

export const chatService = new ChatService();