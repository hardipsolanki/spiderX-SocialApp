import firestore from '@react-native-firebase/firestore';
import { authServices } from './auth';

class ConnectionService {
    private connectionRequest = firestore().collection('connection-request');
    private usersCollection = firestore().collection('users');
    private addInterestsCollection = firestore().collection('user-interests');

    async sendConnectionRequest(senderUid: string, receiverUid: string) {
        try {
            const senderUser = await authServices.getUserRef(senderUid)
            const receiverUser = await authServices.getUserRef(receiverUid)

            await this.connectionRequest.add({
                send_by: senderUser,
                received_by: receiverUser,
                createdAt: firestore.FieldValue.serverTimestamp(),
            })

            await receiverUser?.update({
                connectionReq: "pending"
            })

            // also add new filed in user - interests collleciton  conectionReq : "pending"
            await this.addInterestsCollection.where('user', '==', receiverUser).get().then(async (snapshot) => {
                if (!snapshot.empty) {
                    await this.addInterestsCollection.doc(snapshot.docs[0].id).update({
                        connectionReq: "pending"
                    })
                }
            })
        } catch (error) {
            console.error('Error sending connection request:', error);
            throw error
        }
    }
    async getReceivedConnectionRequests(receiverUid: string) {
        const receiverRef = await authServices.getUserRef(receiverUid)
        const snapshot = await this.connectionRequest
            .where('received_by', '==', receiverRef)
            .get();

        if (snapshot.empty) return [];

        const requests = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();

                const sendBySnap = await data.send_by.get();
                const receivedBySnap = await data.received_by.get();

                return {
                    requestId: doc.id,
                    sendBy: { uid: sendBySnap.id, ...sendBySnap.data() },
                    receivedBy: { uid: receivedBySnap.id, ...receivedBySnap.data() },
                };
            })
        );
        const sendConnections = requests.map((request) => {
            if (request.receivedBy.uid === receiverUid) return { ...request.sendBy, requestId: request.requestId }
        });
        return sendConnections;
    }

    async getSendConnectionRequests(senderUid: string) {
        const senderRef = await authServices.getUserRef(senderUid)
        const snapshot = await this.connectionRequest
            .where('send_by', '==', senderRef)
            .get();

        if (snapshot.empty) return [];

        const requests = await Promise.all(
            snapshot.docs.map(async (doc) => {
                const data = doc.data();

                const sendBySnap = await data.send_by.get();
                const receivedBySnap = await data.received_by.get();

                return {
                    requestId: doc.id,
                    sendBy: { uid: sendBySnap.id, ...sendBySnap.data() },
                    receivedBy: { uid: receivedBySnap.id, ...receivedBySnap.data() },
                };
            })
        );
        const sendConnections = requests.map((request) => {
            if (request.sendBy.uid === senderUid) return { ...request.receivedBy, requestId: request.requestId }
        });
        return sendConnections;
    }

    async rejectAndRenoveConnectionRequest(requestId: string, rejecteUid: string) {
        try {
            const receivedUser = await authServices.getUserRef(rejecteUid)
             await receivedUser?.update({
                connectionReq: "rejected"
            })
            // also add new filed in user - interests collleciton  conectionReq : "pending"
            await this.addInterestsCollection.where('user', '==', receivedUser).get().then(async (snapshot) => {
                if (!snapshot.empty) {
                    await this.addInterestsCollection.doc(snapshot.docs[0].id).update({
                        connectionReq: "rejected"
                    })
                }
            })
            await this.connectionRequest.doc(requestId).delete();
        } catch (error) {
            console.error('Error rejecting connection request:', error);
            throw error
        }
    }

}


export const connectionService = new ConnectionService()
