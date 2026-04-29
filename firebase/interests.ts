import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

class InterestsService {
    private interestsCollection = firestore().collection('interests');
    private addInterestsCollection = firestore().collection('user-interests');
    async getInterests() {
        try {
            const intrests = await this.interestsCollection.get()
            console.log("intreset: ", intrests.docs)
            return intrests.docs[0].data()
        } catch (error) {
            console.error('Error getting user interests:', error);
        }
    }

    async addUserInterest(userRef: FirebaseFirestoreTypes.DocumentReference, interest: string[]) {
        try {
            await this.addInterestsCollection.add({
                user: userRef,
                interest
            })
        } catch (error) {
            console.error('Error adding user interest:', error);
        }
    }
}


export const interestsService = new InterestsService()
