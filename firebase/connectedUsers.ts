import { Connection } from '@/types';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { authServices } from './auth';

class ConnectedUserServces {
    private db = firestore();
    private connectionRequestCollection = this.db.collection('connection-request');
    private connectedUsersCollection = this.db.collection('connected-users');
    async acceptConnectionRequest(senderUid: string, receiverUid: string) {
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

            const requestSnap = await this.connectionRequestCollection
                .where('send_by', '==', senderRef)
                .where('received_by', '==', receiverRef)
                .get();
            if (requestSnap.empty) throw new Error('Connection request not found');

            const requestId = requestSnap.docs[0].id;
            const requestRef = this.connectionRequestCollection.doc(requestId);

            batch.update(requestRef, {
                connectionReqStatus: "accepted"
            });

            await batch.commit();

        } catch (error) {
            console.log("error while accept request: ", error)
        }
    }
    async getConnections(uid: string) {
        try {
            const userRef = await authServices.getUserRef(uid);

            const snapshot = await this.connectedUsersCollection
                .where('connection_of_user', '==', userRef)
                .get();

            if (snapshot.empty) return [];

            const connectionsRefs: FirebaseFirestoreTypes.DocumentReference[] =
                snapshot.docs[0].data().connections || [];

            if (connectionsRefs.length === 0) return [];

            const users = await Promise.all(
                connectionsRefs.map(async (ref) => {
                    const userSnap = await ref.get();
                    return {
                        ...userSnap.data(),
                        requestId: snapshot.docs[0].id,
                    } as Connection;
                })
            );

            return users;

        } catch (error) {
            console.error('Error fetching connections:', error);
            throw error;
        }
    }
}

export const connectedUserServices = new ConnectedUserServces();