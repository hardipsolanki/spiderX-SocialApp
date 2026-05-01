import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { authServices } from './auth';

class ConnectedUserServces {
    private db = firestore();
    private connectionRequestCollection = this.db.collection('connection-request');
    private connectedUsersCollection = this.db.collection('connected-users');
    private usersCollection = this.db.collection('users');
    private addInterestsCollection = this.db.collection('user-interests');
    async acceptConnectionRequest(requestId: string, senderUid: string, receiverUid: string) {
        try {
            const batch = this.db.batch();

            const senderConnectionRef = this.connectedUsersCollection.doc(senderUid);
            const receiverConnectionRef = this.connectedUsersCollection.doc(receiverUid);

            const senderRef = await authServices.getUserRef(senderUid);
            const receiverRef = await authServices.getUserRef(receiverUid);
            if (!senderRef || !receiverRef) throw new Error('Sender or receiver user not found');

            batch.set(senderConnectionRef, {
                connection_of_user: senderRef,
                connections: firestore.FieldValue.arrayUnion(
                    receiverRef
                ),
            }, { merge: true });

            batch.set(receiverConnectionRef, {
                connection_of_user: receiverRef,
                connections: firestore.FieldValue.arrayUnion(
                    senderRef
                ),
            }, { merge: true });

            const requestRef = this.connectionRequestCollection.doc(requestId);
            batch.delete(requestRef);

            await batch.commit();

            const interestSnap = await this.addInterestsCollection
                .where('user', '==', senderRef)
                .get();

            if (!interestSnap.empty) {
                await this.addInterestsCollection
                    .doc(interestSnap.docs[0].id)
                    .set({ connectionReq: 'accepted' }, { merge: true }); 
            }

            await this.usersCollection
                .doc(senderUid) 
                .set({ connectionReq: 'accepted' }, { merge: true });

        } catch (error) {
            console.log("error while accept request: ", error)
        }
    }
    async getConnections(uid: string) {
        const doc = await this.connectedUsersCollection.doc(uid).get();

        if (!doc.exists) return [];

        const data = doc.data();
        const connectionRefs: FirebaseFirestoreTypes.DocumentReference[] = data?.connections || [];

        if (connectionRefs.length === 0) return [];

        const users = await Promise.all(
            connectionRefs.map(async (ref) => {
                const userSnap = await ref.get();
                return { uid: userSnap.id, ...userSnap.data() };
            })
        );

        return users;
    }
}

export const connectedUserServices = new ConnectedUserServces();