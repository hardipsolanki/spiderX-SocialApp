import firestore from '@react-native-firebase/firestore';
import { authServices } from './auth';

class ConnectionService {
    private connectionRequest = firestore().collection('connection-request');

   async sendConnectionRequest(senderUid: string, receiverUid: string) {
    try {
        const senderUser = await authServices.getUserRef(senderUid);
        const receiverUser = await authServices.getUserRef(receiverUid);

        // A→B check
        const existingRequestSnapshot = await this.connectionRequest
            .where('send_by', '==', senderUser)
            .where('received_by', '==', receiverUser)
            .get();

        //  B→A check — reverse direction
        const reverseRequestSnapshot = await this.connectionRequest
            .where('send_by', '==', receiverUser)
            .where('received_by', '==', senderUser)
            .get();

        if (!existingRequestSnapshot.empty) {
            // A→B document already exist — update status
            const requestId = existingRequestSnapshot.docs[0].id;
            await this.connectionRequest.doc(requestId).update({
                connectionReqStatus: 'pending'
            });
            return;
        }

        if (!reverseRequestSnapshot.empty) {
            // B→A document already exist — same document update karo
            const requestId = reverseRequestSnapshot.docs[0].id;
            await this.connectionRequest.doc(requestId).update({
                connectionReqStatus: 'pending',
                send_by: senderUser,     
                received_by: receiverUser
            });
            return;
        }

        //  Totally new request — navu document banavo
        await this.connectionRequest.add({
            send_by: senderUser,
            received_by: receiverUser,
            createdAt: firestore.FieldValue.serverTimestamp(),
            connectionReqStatus: "pending"
        });

    } catch (error) {
        console.error('Error sending connection request:', error);
        throw error;
    }
}
    async getReceivedConnectionRequests(receiverUid: string) {
        const receiverRef = await authServices.getUserRef(receiverUid)
        const snapshot = await this.connectionRequest
            .where('received_by', '==', receiverRef)
            .where('connectionReqStatus', '==', 'pending')
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
            .where('connectionReqStatus', '==', 'pending')
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

    async rejectAndRenoveConnectionRequest(requestId: string) {
        try {
           
            await this.connectionRequest.doc(requestId).update({
                connectionReqStatus: "rejected"
            });

        } catch (error) {
            console.error('Error rejecting connection request:', error);
            throw error
        }
    }

}


export const connectionService = new ConnectionService()
