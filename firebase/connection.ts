import firestore from '@react-native-firebase/firestore';

class ConnectionService {
    private interestsCollection = firestore().collection('connection-request');
    private usersCollection = firestore().collection('users');

    async sendConnectionRequest(senderUid: string, receiverUid: string) {
        try {
            const senderUser = await this.usersCollection.doc(senderUid).get()
            const receiverUser = await this.usersCollection.doc(receiverUid).get()
            await this.interestsCollection.add({
                send_by: senderUser.ref,
                received_by: receiverUser.ref
            })
        } catch (error) {
            console.error('Error sending connection request:', error);
            throw error
        }
    }
    async getConnectionRequests(receiverUid: string) {
        try {
            const snapshot = await this.interestsCollection.where('received_by', '==', this.usersCollection.doc(receiverUid)).get()
            console.log({data: snapshot.docs})
            return snapshot.docs.map(doc => doc.data())
        } catch (error) {
            console.error('Error getting connection requests:', error);
            throw error
        }
    }
}


export const connectionService = new ConnectionService()
